import { Box, BoxProps, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface LatticeGridProps {
  multiplicand: number[];
  multiplier: number[];
  carryTop: number[];
  carryRight: number[];
  lattice?: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

function getDiagonalDelay(c: number, r: number, m: number, n: number) {
  let count = 0;

  // Iterate over each cell and check if it's southeast of the line or on the line but to the northeast
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (i > -j + r + c || (i === -j + r + c && j > c)) {
        count++;
      }
    }
  }

  return count * diagonalAnimationDuration + getGridAnimationDuration(n);
}

const diagonalAnimationDuration = 50;
const getGridAnimationDuration = (numRows: number) =>
  ((numRows + 1) * 2 + 1) * 100;
const cellSize = 40;
const revealElement = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
`;

const CellDiagonal = ({
  diagonalLength,
  ...props
}: { diagonalLength: number } & BoxProps) => (
  <Box
    position="absolute"
    bottom={0}
    left={0}
    height={`${diagonalLength + 1}px`}
    width={`${diagonalLength + 1}px`}
    borderBottom="2px"
    transformOrigin="bottom left"
    transform={`translate(40px, -41px) rotate(-225deg)`}
    marginLeft="-1px"
    {...props}
  />
);

function LatticeGrid({
  multiplicand,
  multiplier,
  carryTop,
  carryRight,
  lattice,
  totalsBottom,
  totalsLeft,
  ...props
}: LatticeGridProps & BoxProps) {
  const numColumns = multiplicand.length;
  const numRows = multiplier.length;
  const diagonalLength = Math.sqrt(cellSize * cellSize * 2);

  const backgroundColor = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.400", "gray.500");

  function getGridLineDelay(rowIndex: number, colIndex: number) {
    const isTopEdge = rowIndex === 0 && colIndex === -1;
    const isRightEdge = colIndex === numColumns && rowIndex === -1;
    const isBottomEdge = rowIndex === numRows && colIndex === -1;
    const isLeftEdge = colIndex === 0 && rowIndex === -1;
    const delay = isTopEdge
      ? 0
      : isRightEdge
      ? 1 * 100
      : isBottomEdge
      ? 2 * 100
      : isLeftEdge
      ? 3 * 100
      : (rowIndex === -1
          ? (numRows - 1) * 100 + colIndex * 50
          : rowIndex * 50) +
        4 * 100;
    return delay;
  }

  return (
    <Box {...props}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        position="relative"
      >
        <Flex direction="row" align="center" justify="center">
          <Box w={`${cellSize}px`} h={`${cellSize}px`} />
          {multiplicand.map((digit, index) => (
            <Box
              key={index}
              w={`${cellSize}px`}
              h={`${cellSize}px`}
              display="flex"
              position="relative"
              overflow="hidden"
            >
              {!Number.isNaN(digit) && (
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  width={`${cellSize}px`}
                  textAlign="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  css={{
                    clipPath: "inset(0 100% 0 0)",
                    animation: `0.2s ${revealElement} forwards ${
                      index * 2 + 1
                    }00ms ease-in-out`,
                  }}
                >
                  {digit}
                </Text>
              )}
              {Number.isInteger(carryTop[index]) && (
                <Text
                  fontSize="sm"
                  position="absolute"
                  top={`${cellSize * 0.75}px`}
                  left={`${cellSize * 0.75}px`}
                  transform="translate(-50%, -50%)"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  css={{
                    clipPath: "inset(0 100% 0 0)",
                    animation: `0.2s ${revealElement} forwards 100ms ease-in-out`,
                  }}
                >
                  {carryTop[index]}
                </Text>
              )}
            </Box>
          ))}
          <Box w={`${cellSize}px`} h={`${cellSize}px`} />
        </Flex>
        {[...Array(numRows + 1)].map((_, rowIndex) => {
          const digit = multiplier[rowIndex];
          return (
            <Flex
              key={rowIndex}
              direction="row"
              align="center"
              justify="center"
            >
              <Box
                w={`${cellSize}px`}
                h={`${cellSize}px`}
                position="relative"
                overflow="hidden"
              >
                {rowIndex < numRows &&
                  Number.isInteger(totalsLeft[rowIndex]) && (
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      position="absolute"
                      top={`${cellSize * 0.75}px`}
                      left={`${cellSize * 0.75}px`}
                      transform="translate(-50%, -50%)"
                      css={{
                        clipPath: "inset(0 100% 0 0)",
                        animation: `0.2s ${revealElement} forwards 0ms ease-in-out`,
                      }}
                    >
                      {rowIndex < numRows && totalsLeft[rowIndex]}
                    </Text>
                  )}
                {lattice && (
                  <CellDiagonal
                    diagonalLength={diagonalLength / 2}
                    borderColor={borderColor}
                    css={{
                      clipPath: "inset(0 100% 0 0)",
                      animation: `${diagonalAnimationDuration}ms ${revealElement} forwards ${getDiagonalDelay(
                        1,
                        rowIndex + 1,
                        numColumns + 1,
                        numRows + 1
                      )}ms linear`,
                    }}
                  ></CellDiagonal>
                )}
              </Box>
              {[...Array(numColumns)].map((_, colIndex) => {
                const row = rowIndex;
                const col = colIndex;

                return (
                  <Box
                    key={colIndex}
                    w={`${cellSize}px`}
                    h={`${cellSize}px`}
                    position="relative"
                    overflow="hidden"
                    // zIndex to put the grid cell in front of the background color box
                    zIndex={1}
                  >
                    {lattice && lattice[col] && lattice[col][row] && (
                      <>
                        {!Number.isNaN(lattice[col][row][0]) && (
                          <Text
                            fontSize="sm"
                            position="absolute"
                            top={`${cellSize * 0.25}px`}
                            left={`${cellSize * 0.25}px`}
                            transform="translate(-50%, -50%)"
                            css={{
                              clipPath: "inset(0 100% 0 0)",
                              animation: `0.2s ${revealElement} forwards 0ms ease-in-out`,
                            }}
                          >
                            {lattice[col][row][0]}
                          </Text>
                        )}
                        {!Number.isNaN(lattice[col][row][1]) && (
                          <Text
                            fontSize="sm"
                            position="absolute"
                            top={`${cellSize * 0.75}px`}
                            left={`${cellSize * 0.75}px`}
                            transform="translate(-50%, -50%)"
                            css={{
                              clipPath: "inset(0 100% 0 0)",
                              animation: `0.2s ${revealElement} forwards 100ms ease-in-out`,
                            }}
                          >
                            {lattice[col][row][1]}
                          </Text>
                        )}
                      </>
                    )}
                    {row === numRows &&
                      Number.isInteger(totalsBottom[colIndex]) && (
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          position="absolute"
                          top={`${cellSize * 0.25}px`}
                          left={`${cellSize * 0.25}px`}
                          transform="translate(-50%, -50%)"
                          css={{
                            clipPath: "inset(0 100% 0 0)",
                            animation: `0.2s ${revealElement} forwards 0ms ease-in-out`,
                          }}
                        >
                          {totalsBottom[colIndex]}
                        </Text>
                      )}
                    {lattice && (
                      <CellDiagonal
                        diagonalLength={
                          row === numRows ? diagonalLength / 2 : diagonalLength
                        }
                        borderColor={borderColor}
                        css={{
                          clipPath: "inset(0 100% 0 0)",
                          animation: `${diagonalAnimationDuration}ms ${revealElement} forwards ${getDiagonalDelay(
                            colIndex + 2,
                            rowIndex + 1,
                            numColumns + 1,
                            numRows + 1
                          )}ms linear`,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
              <Box
                w={`${cellSize}px`}
                h={`${cellSize}px`}
                display="flex"
                position="relative"
              >
                {!Number.isNaN(digit) && (
                  <Text
                    position="absolute"
                    top={`${cellSize * 0.5}px`}
                    left={`${cellSize * 0.75}px`}
                    transform="translate(-50%, -50%)"
                    fontSize="md"
                    fontWeight="bold"
                    marginLeft={1}
                    css={{
                      clipPath: "inset(0 100% 0 0)",
                      animation: `0.2s ${revealElement} forwards ${
                        rowIndex * 2 + 1
                      }00ms ease-in-out`,
                    }}
                  >
                    {digit}
                  </Text>
                )}
                {Number.isInteger(carryRight[rowIndex]) && (
                  <Text
                    fontSize="sm"
                    position="absolute"
                    top={`${cellSize * 0.25}px`}
                    left={`${cellSize * 0.25}px`}
                    transform="translate(-50%, -50%)"
                    css={{
                      clipPath: "inset(0 100% 0 0)",
                      animation: `0.2s ${revealElement} forwards 100ms ease-in-out`,
                    }}
                  >
                    {carryRight[rowIndex]}
                  </Text>
                )}
              </Box>
            </Flex>
          );
        })}
        {lattice && (
          <Box
            position="absolute"
            width={`${cellSize * numColumns}px`}
            height={`${cellSize * numRows}px`}
          >
            <Box
              position="absolute"
              width={`${cellSize * numColumns}px`}
              height={`${cellSize * numRows}px`}
              bg={backgroundColor}
              css={{
                clipPath: "inset(0 100% 0 0)",
                animation: `300ms ${revealElement} forwards ${getGridAnimationDuration(
                  numRows
                )}ms`,
              }}
            />
            {[...Array(numRows + 1)].map((_, rowIndex) => {
              const flip = rowIndex === numRows || rowIndex % 2 !== 0;
              return (
                <Box
                  key={rowIndex}
                  position="absolute"
                  left={0}
                  top={`${rowIndex * cellSize}px`}
                  width={`${numColumns * cellSize}px`}
                  borderBottom="2px solid"
                  borderColor={borderColor}
                  transform={`rotate(${flip ? -180 : 0}deg) translate(${
                    flip ? -numColumns * cellSize : 0
                  }px, ${flip ? 2 : 0}px)`}
                  transformOrigin="bottom left"
                  css={{
                    clipPath: "inset(0 100% 0 0)",
                    animation: `100ms ${revealElement} forwards ${getGridLineDelay(
                      rowIndex,
                      -1
                    )}ms`,
                  }}
                />
              );
            })}
            {[...Array(numColumns + 1)].map((_, colIndex) => {
              const flip = colIndex !== numColumns && colIndex % 2 === 0;
              return (
                <Box
                  key={"c" + colIndex}
                  position="absolute"
                  left={`${colIndex * cellSize}px`}
                  width={`${numRows * cellSize + 2}px`}
                  borderBottom="2px solid"
                  borderColor={borderColor}
                  transform={`rotate(${flip ? -90 : 90}deg) translate(${
                    flip ? -numRows * cellSize : -2
                  }px, ${flip ? 0 : 2}px)`}
                  transformOrigin="bottom left"
                  css={{
                    clipPath: "inset(0 100% 0 0)",
                    animation: `100ms ${revealElement} forwards ${getGridLineDelay(
                      -1,
                      colIndex
                    )}ms`,
                  }}
                />
              );
            })}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default LatticeGrid;

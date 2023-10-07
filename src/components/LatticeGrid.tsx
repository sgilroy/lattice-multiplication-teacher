import { Box, BoxProps, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface LatticeGridProps {
  multiplicand: number[];
  multiplier: number[];
  lattice?: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

function getDiagonalDelay(c: number, r: number, m: number, n: number) {
  let count = 0;

  // Iterate over each cell and check if it's southeast of the line or on the line but to the northeast
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (i < -j + r + c || (i === -j + r + c && j > c)) {
        count++;
      }
    }
  }

  return count;
}

const diagonalAnimationDuration = 50;
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
    borderColor="gray.400"
    transformOrigin="bottom left"
    transform={`translate(40px, -41px) rotate(-225deg)`}
    marginLeft="-1px"
    {...props}
  />
);

function LatticeGrid({
  multiplicand,
  multiplier,
  lattice,
  totalsBottom,
  totalsLeft,
  ...props
}: LatticeGridProps & BoxProps) {
  const numColumns = multiplicand.length;
  const numRows = multiplier.length;
  const diagonalLength = Math.sqrt(cellSize * cellSize * 2);

  const bg = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.400", "gray.500");

  return (
    <Box {...props}>
      <Flex direction="column" align="center" justify="center">
        <Flex direction="row" align="center" justify="center">
          <Box w={`${cellSize}px`} h={`${cellSize}px`} />
          {multiplicand.map((digit, index) => (
            <Box
              key={index}
              w={`${cellSize}px`}
              h={`${cellSize}px`}
              display="flex"
              alignItems="flex-end"
              overflow="hidden"
            >
              {!Number.isNaN(digit) && (
                <Text
                  fontSize="sm"
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
                        animation: `0.2s ${revealElement} forwards ${
                          (numRows - rowIndex) * 2 + 1
                        }00ms ease-in-out`,
                      }}
                    >
                      {rowIndex < numRows && totalsLeft[rowIndex]}
                    </Text>
                  )}
                {lattice && (
                  <CellDiagonal
                    diagonalLength={diagonalLength / 2}
                    css={{
                      clipPath: "inset(0 100% 0 0)",
                      animation: `${diagonalAnimationDuration}ms ${revealElement} forwards ${
                        getDiagonalDelay(
                          1,
                          rowIndex + 1,
                          numColumns + 1,
                          numRows + 1
                        ) * diagonalAnimationDuration
                        // (numRows - rowIndex) * colIndex * 100
                      }ms linear`,
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
                    bg={lattice && lattice[col] && lattice[col][row] ? bg : ""}
                    borderWidth={
                      lattice && lattice[col] && lattice[col][row] ? "1px" : 0
                    }
                    borderColor={borderColor}
                    position="relative"
                    overflow="hidden"
                    css={{
                      clipPath: "inset(0 100% 0 0)",
                      animation: `0.2s ${revealElement} forwards ${
                        rowIndex * 2 + 1
                      }00ms ease-in-out`,
                    }}
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
                              animation: `0.2s ${revealElement} forwards ${
                                rowIndex * 2 + 1
                              }00ms ease-in-out`,
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
                              animation: `0.2s ${revealElement} forwards ${
                                rowIndex * 2 + 2
                              }00ms ease-in-out`,
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
                            animation: `0.2s ${revealElement} forwards ${
                              (numColumns - colIndex) * 2 + 1
                            }00ms ease-in-out`,
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
                        css={{
                          clipPath: "inset(0 100% 0 0)",
                          animation: `${diagonalAnimationDuration}ms ${revealElement} forwards ${
                            getDiagonalDelay(
                              colIndex + 2,
                              rowIndex + 1,
                              numColumns + 1,
                              numRows + 1
                            ) * diagonalAnimationDuration
                          }ms linear`,
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
                alignItems="center"
              >
                {!Number.isNaN(digit) && (
                  <Text
                    fontSize="sm"
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
              </Box>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

export default LatticeGrid;

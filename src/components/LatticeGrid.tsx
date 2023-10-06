import { Box, Flex, Text } from "@chakra-ui/react";

interface LatticeGridProps {
  multiplicand: number[];
  multiplier: number[];
  lattice: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

const CellDiagonal = ({ diagonalLength }: { diagonalLength: number }) => (
  <Box
    position="absolute"
    bottom={0}
    left={0}
    height={`${diagonalLength + 1}px`}
    width={`${diagonalLength + 1}px`}
    borderLeft="2px"
    borderColor="gray.400"
    transformOrigin="bottom left"
    transform={`translate(43px, -40px) rotate(-135deg) translate(0px, 0px)`}
    marginLeft="-1px"
  />
);

function LatticeGrid({
  multiplicand,
  multiplier,
  lattice,
  totalsBottom,
  totalsLeft,
}: LatticeGridProps) {
  const numColumns = multiplicand.length;
  const numRows = multiplier.length;
  const cellSize = 40;
  const diagonalLength = Math.sqrt(cellSize * cellSize * 2);

  return (
    <Box>
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
            >
              {!Number.isNaN(digit) && (
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  width="100%"
                  textAlign="center"
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
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  position="absolute"
                  top={`${cellSize * 0.75}px`}
                  left={`${cellSize * 0.75}px`}
                  transform="translate(-50%, -50%)"
                >
                  {rowIndex < numRows && totalsLeft[rowIndex]}
                </Text>
                <CellDiagonal
                  diagonalLength={diagonalLength / 2}
                ></CellDiagonal>
              </Box>
              {[...Array(numColumns)].map((_, colIndex) => {
                const row = rowIndex;
                const col = colIndex;

                return (
                  <Box
                    key={colIndex}
                    w={`${cellSize}px`}
                    h={`${cellSize}px`}
                    bg={lattice[col] && lattice[col][row] ? "gray.200" : ""}
                    borderWidth={lattice[col] && lattice[col][row] ? "1px" : 0}
                    borderColor="gray.400"
                    position="relative"
                    overflow="hidden"
                  >
                    {lattice[col] && lattice[col][row] && (
                      <>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          position="absolute"
                          top={`${cellSize * 0.25}px`}
                          left={`${cellSize * 0.25}px`}
                          transform="translate(-50%, -50%)"
                        >
                          {lattice[col][row][0]}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          fontStyle="italic"
                          position="absolute"
                          top={`${cellSize * 0.75}px`}
                          left={`${cellSize * 0.75}px`}
                          transform="translate(-50%, -50%)"
                        >
                          {lattice[col][row][1]}
                        </Text>
                      </>
                    )}
                    {row === numRows && (
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        position="absolute"
                        top={`${cellSize * 0.25}px`}
                        left={`${cellSize * 0.25}px`}
                        transform="translate(-50%, -50%)"
                      >
                        {totalsBottom[colIndex]}
                      </Text>
                    )}
                    <CellDiagonal
                      diagonalLength={
                        row === numRows ? diagonalLength / 2 : diagonalLength
                      }
                    ></CellDiagonal>
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
                  <Text fontSize="sm" fontWeight="bold" marginLeft={1}>
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

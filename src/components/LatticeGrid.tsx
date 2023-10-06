import { Box, Flex, Text } from "@chakra-ui/react";

interface LatticeGridProps {
  multiplicand: number;
  multiplier: number;
  lattice: number[][];
}

function LatticeGrid({ multiplicand, multiplier, lattice }: LatticeGridProps) {
  const multiplicandDigits = multiplicand.toString().split("").map(Number);
  const multiplierDigits = multiplier.toString().split("").map(Number);
  const numColumns = multiplicandDigits.length + multiplierDigits.length - 1;

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Lattice Multiplication
      </Text>
      <Flex direction="column" align="center" justify="center">
        <Flex direction="row" align="center" justify="center">
          {multiplicandDigits.map((digit, index) => (
            <Box key={index} w="20px" h="20px" bg="yellow.200">
              <Text fontSize="sm" fontWeight="bold">
                {digit}
              </Text>
            </Box>
          ))}
        </Flex>
        {[...Array(numColumns)].map((_, index) => (
          <Flex key={index} direction="row" align="center" justify="center">
            {multiplierDigits.map((digit, innerIndex) => {
              const row = index - innerIndex;
              const col = innerIndex;
              if (
                row < 0 ||
                row >= multiplicandDigits.length ||
                col < 0 ||
                col >= multiplierDigits.length
              ) {
                return <Box key={innerIndex} w="20px" h="20px" />;
              } else if (row === col) {
                return (
                  <Box
                    key={innerIndex}
                    w="20px"
                    h="20px"
                    bg="gray.200"
                    borderWidth="1px"
                    borderColor="gray.400"
                  />
                );
              } else if (row < col) {
                return (
                  <Box
                    key={innerIndex}
                    w="20px"
                    h="20px"
                    bg="gray.200"
                    borderWidth="1px"
                    borderColor="gray.400"
                  >
                    <Text fontSize="sm" fontWeight="bold">
                      {lattice[row][col - row]}
                    </Text>
                  </Box>
                );
              } else {
                return (
                  <Box
                    key={innerIndex}
                    w="20px"
                    h="20px"
                    bg="gray.200"
                    borderWidth="1px"
                    borderColor="gray.400"
                  >
                    <Text fontSize="sm" fontWeight="bold">
                      {lattice[row][col + multiplicandDigits.length - row - 1]}
                    </Text>
                  </Box>
                );
              }
            })}
          </Flex>
        ))}
      </Flex>
      <Flex direction="row" align="center" justify="center">
        {multiplierDigits.map((digit, index) => (
          <Box
            key={index}
            w="20px"
            h="20px"
            bg="gray.200"
            borderWidth="1px"
            borderColor="gray.400"
          >
            <Text fontSize="sm" fontWeight="bold">
              {digit}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

export default LatticeGrid;

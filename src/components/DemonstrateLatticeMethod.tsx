import { Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaRandom } from "react-icons/fa";
import LatticeSolutionSteps from "./LatticeSolutionSteps";

function DemonstrateLatticeMethod() {
  const [multiplicand, setMultiplicand] = useState<number | "">(321);
  const [multiplier, setMultiplier] = useState<number | "">(12);

  const handleRandomize = () => {
    const randomMultiplicand = Math.floor(Math.random() * 9900) + 100;
    const randomMultiplier = Math.floor(Math.random() * 9900) + 100;
    setMultiplicand(randomMultiplicand);
    setMultiplier(randomMultiplier);
  };

  return (
    <Box p={4}>
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold" mr={2}>
          Multiply
        </Text>
        <Flex direction="row" align="center" mb={4}>
          <IconButton
            aria-label="Randomize"
            icon={<FaRandom />}
            onClick={handleRandomize}
          />

          <Input
            placeholder="Multiplicand"
            value={multiplicand}
            onChange={(e) => setMultiplicand(parseInt(e.target.value))}
            mr={2}
          />
          <Text fontWeight="bold" mr={2}>
            x
          </Text>
          <Input
            placeholder="Multiplier"
            value={multiplier}
            onChange={(e) => setMultiplier(parseInt(e.target.value))}
            mr={2}
          />
        </Flex>
      </Flex>
      {multiplicand && multiplier && (
        <LatticeSolutionSteps
          multiplicand={multiplicand}
          multiplier={multiplier}
        />
      )}
    </Box>
  );
}

export default DemonstrateLatticeMethod;

import { Box, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaRandom } from "react-icons/fa";
import LatticeSolver from "./LatticeSolver";

function DemonstrateLatticeMethod() {
  const [multiplicand, setMultiplicand] = useState<number | "">("");
  const [multiplier, setMultiplier] = useState<number | "">("");

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
        <LatticeSolver multiplicand={multiplicand} multiplier={multiplier} />
      )}
    </Box>
  );
}

export default DemonstrateLatticeMethod;

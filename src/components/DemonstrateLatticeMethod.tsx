import {
  Box,
  Flex,
  IconButton,
  Input,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaRandom, FaSun, FaMoon } from "react-icons/fa";
import LatticeSolutionSteps from "./LatticeSolutionSteps";

function DemonstrateLatticeMethod() {
  const [multiplicand, setMultiplicand] = useState<number | "">(321);
  const [multiplier, setMultiplier] = useState<number | "">(12);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleRandomize = () => {
    const randomMultiplicand = Math.floor(Math.random() * 9900) + 100;
    const randomMultiplier = Math.floor(Math.random() * 9900) + 100;
    setMultiplicand(randomMultiplicand);
    setMultiplier(randomMultiplier);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMultiplicand = urlParams.get("multiplicand") || urlParams.get("a");
    if (urlMultiplicand) {
      setMultiplicand(parseInt(urlMultiplicand));
    }
    const urlMultiplier = urlParams.get("multiplier") || urlParams.get("b");
    if (urlMultiplier) {
      setMultiplier(parseInt(urlMultiplier));
    }
  }, []);

  return (
    <Box p={4}>
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        mb={4}
        gap={3}
      >
        <Flex direction="row" width="100%">
          <Text fontSize="xl" fontWeight="bold" mr={2}>
            Multiply
          </Text>
          <Spacer />
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Flex>
        <Flex direction="row" align="center">
          <IconButton
            aria-label="Randomize"
            icon={<FaRandom />}
            onClick={handleRandomize}
            mr={2}
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

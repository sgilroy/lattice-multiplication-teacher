import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRedo } from "react-icons/fa";
import LatticeGrid from "./LatticeGrid";

interface SolutionStep {
  stepNumber: number;
  description: string;
  lattice: number[][];
}

function LatticeSolver({
  multiplicand,
  multiplier,
}: {
  multiplicand: number;
  multiplier: number;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleGo = () => {
    setShowSolution(true);
    const steps: SolutionStep[] = [];
    const multiplicandDigits = multiplicand.toString().split("").map(Number);
    const multiplierDigits = multiplier.toString().split("").map(Number);
    const lattice = multiplicandDigits.map(() => multiplierDigits.map(() => 0));
    for (let i = 0; i < multiplicandDigits.length; i++) {
      for (let j = 0; j < multiplierDigits.length; j++) {
        lattice[i][j + i] = multiplicandDigits[i] * multiplierDigits[j];
      }
      steps.push({
        stepNumber: i + 1,
        description: `Multiply ${multiplicandDigits[i]} with each digit of ${multiplier}`,
        lattice: lattice.map((row) => [...row]),
      });
    }
    const rowSums = lattice.map((row) =>
      row.reduce((acc, val) => acc + val, 0)
    );
    steps.push({
      stepNumber: multiplicandDigits.length + 1,
      description: "Add the numbers in each row",
      lattice: lattice.map((row, index) => [...row, rowSums[index]]),
    });
    const total = rowSums.reduce((acc, val) => acc + val, 0);
    steps.push({
      stepNumber: multiplicandDigits.length + 2,
      description: "Add the row sums to get the final answer",
      lattice: [...lattice, rowSums].map((row) => [...row, total]),
    });
    setSolutionSteps(steps);
  };

  useEffect(() => {
    if (showSolution) {
      const timer = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex === solutionSteps.length - 1) {
            clearInterval(timer);
            return prevIndex;
          } else {
            return prevIndex + 1;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSolution, solutionSteps]);

  const handleReset = () => {
    setShowSolution(false);
    setCurrentStepIndex(0);
  };

  return (
    <Box p={4}>
      <Flex direction="row" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" mr={2}>
          Multiply {multiplicand} by {multiplier}
        </Text>
        <IconButton
          aria-label="Reset"
          icon={<FaRedo />}
          onClick={handleReset}
          ml="auto"
        />
      </Flex>
      {showSolution && (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Lattice Multiplication Solution
          </Text>
          <Box>
            <LatticeGrid
              lattice={solutionSteps[currentStepIndex].lattice}
              multiplicand={multiplicand}
              multiplier={multiplier}
            />
            <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>
              Step {solutionSteps[currentStepIndex].stepNumber}:{" "}
              {solutionSteps[currentStepIndex].description}
            </Text>
          </Box>
        </Box>
      )}
      {!showSolution && (
        <Flex direction="row" align="center">
          <IconButton
            aria-label="Go"
            icon={<Text>Go</Text>}
            onClick={handleGo}
          />
        </Flex>
      )}
    </Box>
  );
}

export default LatticeSolver;

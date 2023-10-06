import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaUndo,
} from "react-icons/fa";
import LatticeGrid from "./LatticeGrid";

interface LatticeSolutionStepsProps {
  multiplicand: number;
  multiplier: number;
}

interface SolutionStep {
  multiplicand: number[];
  multiplier: number[];
  lattice: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

function LatticeSolutionSteps({
  multiplicand,
  multiplier,
}: LatticeSolutionStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const multiplicandDigits = multiplicand.toString().split("").map(Number);
    const multiplierDigits = multiplier.toString().split("").map(Number);
    const lattice = multiplicandDigits.map(() =>
      multiplierDigits.map(() => [0, 0])
    );
    for (let i = 0; i < multiplicandDigits.length; i++) {
      for (let j = 0; j < multiplierDigits.length; j++) {
        const product = multiplicandDigits[i] * multiplierDigits[j];
        lattice[i][j][0] = Math.floor(product / 10);
        lattice[i][j][1] = product % 10;
      }
    }
    const product = multiplicand * multiplier;
    const productString = product.toString();
    const totalsBottom = productString
      .slice(productString.length - multiplicandDigits.length)
      .split("")
      .map(Number);
    const totalsLeft = productString
      .slice(0, productString.length - multiplicandDigits.length)
      .split("")
      .map(Number);
    const totalsLeftPadded = new Array(
      multiplierDigits.length - totalsLeft.length
    )
      .fill(0)
      .concat(totalsLeft);

    const solution: number[] = [];
    let carry = 0;
    for (let i = totalsBottom.length - 1; i >= 0; i--) {
      const sum = totalsBottom[i] + carry;
      solution.unshift(sum % 10);
      carry = Math.floor(sum / 10);
    }
    for (let i = totalsLeft.length - 1; i >= 0; i--) {
      const sum = totalsLeft[i] + carry;
      solution.unshift(sum % 10);
      carry = Math.floor(sum / 10);
    }
    if (carry > 0) {
      solution.unshift(carry);
    }
    setSolution(solution);

    const steps: SolutionStep[] = [];
    for (let i = 0; i <= 7; i++) {
      const step: SolutionStep = {
        multiplicand:
          i >= 1
            ? multiplicandDigits
            : Array(multiplicandDigits.length).fill(undefined).map(Number),
        multiplier:
          i >= 2
            ? multiplierDigits
            : Array(multiplierDigits.length).fill(undefined).map(Number),
        lattice: [],
        totalsBottom: [],
        totalsLeft: [],
      };
      if (i >= 4) {
        step.lattice = lattice;
      }
      if (i >= 5) {
        step.totalsBottom = totalsBottom;
      }
      if (i >= 6) {
        step.totalsLeft = totalsLeftPadded;
      }
      steps.push(step);
    }
    setSolutionSteps(steps);
  }, [multiplicand, multiplier]);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < 7) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePreviousClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  };

  const handleNextClick = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handleResetClick = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentSolutionStep = solutionSteps[currentStep];

  return (
    <Box>
      <Flex direction="row" align="center" justify="center" mt={4}>
        <IconButton
          aria-label="Previous"
          icon={<FaStepBackward />}
          onClick={handlePreviousClick}
          disabled={currentStep === 0 || isPlaying}
        />
        <IconButton
          aria-label={isPlaying ? "Pause" : "Play"}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={handlePlayPauseClick}
          disabled={currentStep === 7}
        />
        <IconButton
          aria-label="Next"
          icon={<FaStepForward />}
          onClick={handleNextClick}
          disabled={currentStep === 7 || isPlaying}
        />
        <IconButton
          aria-label="Reset"
          icon={<FaUndo />}
          onClick={handleResetClick}
          disabled={currentStep === 0}
        />
      </Flex>
      {currentSolutionStep && (
        <LatticeGrid
          multiplicand={currentSolutionStep.multiplicand}
          multiplier={currentSolutionStep.multiplier}
          lattice={currentSolutionStep.lattice}
          totalsBottom={currentSolutionStep.totalsBottom}
          totalsLeft={currentSolutionStep.totalsLeft}
        />
      )}
      {currentStep > 0 && (
        <Text fontSize="lg" fontWeight="bold" mt={4}>
          Step {currentStep}:
          {currentStep === 1 &&
            ` Write the multiplicand ${multiplicand} along the top`}
          {currentStep === 2 &&
            ` Write the multiplier ${multiplier} along the right side`}
          {currentStep === 3 && ` Draw the grid`}
          {currentStep === 4 &&
            ` Multiply each digit of the multiplicand by each digit of the multiplier`}
          {currentStep === 5 &&
            ` Starting from the right, add up the diagonals: ${currentSolutionStep.totalsBottom
              .slice()
              .reverse()
              .join(", ")}`}
          {currentStep === 6 &&
            ` Continue adding diagonals for the left side, bottom to top: ${currentSolutionStep.totalsLeft
              .slice()
              .reverse()
              .join(", ")}`}
          {currentStep === 7 && ` Write out the solution: ${solution.join("")}`}
        </Text>
      )}
    </Box>
  );
}

export default LatticeSolutionSteps;

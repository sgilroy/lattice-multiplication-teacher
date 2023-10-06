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
  const [gridSubsteps, setGridSubsteps] = useState(0);

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
    const gridSubsteps = multiplicandDigits.length * multiplierDigits.length;
    setGridSubsteps(gridSubsteps);
    for (let i = 0; i <= 7 + gridSubsteps; i++) {
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
      if (i >= 3) {
        console.log("latice", i, multiplicandDigits, multiplierDigits);
        step.lattice = multiplicandDigits.map(() =>
          multiplierDigits.map(() => [NaN, NaN])
        );
        // sub steps
        for (let j = 0; j < Math.min(i - 3, gridSubsteps); j++) {
          const row = j % multiplierDigits.length;
          const col = Math.floor(j / multiplierDigits.length);
          const product = multiplicandDigits[col] * multiplierDigits[row];
          step.lattice[col][row][0] = Math.floor(product / 10);
          step.lattice[col][row][1] = product % 10;
          console.log(
            "col, row",
            col,
            row,
            `[${step.lattice[col][row][0]}, ${step.lattice[col][row][1]}]`
          );
        }
      }
      if (i >= 5 + gridSubsteps) {
        step.totalsBottom = totalsBottom.slice();
      }
      if (i >= 6 + gridSubsteps) {
        step.totalsLeft = totalsLeftPadded.slice();
      }
      steps.push(step);
    }
    setSolutionSteps(steps);
  }, [multiplicand, multiplier]);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < solutionSteps.length - 1) {
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
    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handleResetClick = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentSolutionStep = solutionSteps[currentStep];
  const isGridSubstep = currentStep >= 4 && currentStep < 4 + gridSubsteps;
  const colIndex =
    currentSolutionStep &&
    Math.floor((currentStep - 4) / currentSolutionStep.multiplier.length);
  const rowIndex =
    currentSolutionStep &&
    (currentStep - 4) % currentSolutionStep.multiplier.length;
  const row = isGridSubstep && currentSolutionStep.lattice[colIndex];
  const digits = isGridSubstep && row && row[rowIndex];

  console.log("currentStep", currentStep, currentSolutionStep);
  return (
    <Box>
      <Flex direction="row" align="center" justify="center" mt={4}>
        <IconButton
          aria-label="Previous"
          icon={<FaStepBackward />}
          onClick={handlePreviousClick}
          isDisabled={currentStep === 0 || isPlaying}
        />
        <IconButton
          aria-label={isPlaying ? "Pause" : "Play"}
          icon={isPlaying ? <FaPause /> : <FaPlay />}
          onClick={handlePlayPauseClick}
          isDisabled={currentStep === solutionSteps.length - 1}
        />
        <IconButton
          aria-label="Next"
          icon={<FaStepForward />}
          onClick={handleNextClick}
          isDisabled={currentStep === solutionSteps.length - 1 || isPlaying}
        />
        <IconButton
          aria-label="Reset"
          icon={<FaUndo />}
          onClick={handleResetClick}
          isDisabled={currentStep === 0}
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
        <Box fontSize="lg" mt={4}>
          <Text fontWeight="bold">Step {currentStep}:</Text>
          {currentStep === 1 &&
            ` Write the multiplicand ${multiplicand} along the top`}
          {currentStep === 2 &&
            ` Write the multiplier ${multiplier} along the right side`}
          {currentStep === 3 && ` Draw the grid`}
          {isGridSubstep && (
            <>
              Multiply each digit of the multiplicand by each digit of the
              multiplier
              <br />
              <Flex direction="row" key={colIndex} gap={1} ml={4}>
                <Text fontSize="sm" fontWeight="bold">
                  {currentSolutionStep.multiplicand[colIndex]} *{" "}
                  {currentSolutionStep.multiplier[rowIndex]} ={" "}
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {digits && digits[0]}
                  {digits && digits[1]}
                </Text>
              </Flex>
            </>
          )}
          {currentStep === 5 + gridSubsteps &&
            ` Starting from the right, add up the diagonals: ${currentSolutionStep.totalsBottom
              .slice()
              .reverse()
              .join(", ")}`}
          {currentStep === 6 + gridSubsteps &&
            ` Continue adding diagonals for the left side, bottom to top: ${currentSolutionStep.totalsLeft
              .slice()
              .reverse()
              .join(", ")}`}
          {currentStep === 7 + gridSubsteps &&
            ` Write out the solution: ${solution.join("")}`}
        </Box>
      )}
    </Box>
  );
}

export default LatticeSolutionSteps;

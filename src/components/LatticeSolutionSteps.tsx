import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
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
  lattice?: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

const SolutionStepView = (props) => {
  const isGridSubstep =
    props.currentStep >= 4 && props.currentStep < 4 + props.gridSubsteps;
  const colIndex =
    props.currentSolutionStep &&
    Math.floor(
      (props.currentStep - 4) / props.currentSolutionStep.multiplier.length
    );
  const rowIndex =
    props.currentSolutionStep &&
    (props.currentStep - 4) % props.currentSolutionStep.multiplier.length;
  const row = isGridSubstep && props.currentSolutionStep.lattice[colIndex];
  const digits = isGridSubstep && row && row[rowIndex];

  return (
    <>
      {props.currentSolutionStep && (
        <LatticeGrid
          multiplicand={props.currentSolutionStep.multiplicand}
          multiplier={props.currentSolutionStep.multiplier}
          lattice={props.currentSolutionStep.lattice}
          totalsBottom={props.currentSolutionStep.totalsBottom}
          totalsLeft={props.currentSolutionStep.totalsLeft}
        />
      )}
      <Box fontSize="lg" mt={4}>
        <Text fontWeight="bold">Step {props.currentStep}:</Text>
        {props.currentStep === 0 && ` Make space for the numbers and the grid`}
        {props.currentStep === 1 &&
          ` Write the multiplicand ${props.multiplicand} along the top`}
        {props.currentStep === 2 &&
          ` Write the multiplier ${props.multiplier} along the right side`}
        {props.currentStep === 3 && ` Draw the grid`}
        {isGridSubstep && (
          <>
            Multiply each digit of the multiplicand by each digit of the
            multiplier
            <br />
            <Flex direction="row" key={colIndex} gap={1} ml={4}>
              <Text fontSize="sm" fontWeight="bold">
                {props.currentSolutionStep.multiplicand[colIndex]} *{" "}
                {props.currentSolutionStep.multiplier[rowIndex]} ={" "}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {digits && digits[0]}
                {digits && digits[1]}
              </Text>
            </Flex>
          </>
        )}
        {props.currentStep === 4 + props.gridSubsteps &&
          ` Starting from the right, add up the diagonals: ${props.currentSolutionStep.totalsBottom
            .slice()
            .reverse()
            .join(", ")}`}
        {props.currentStep === 5 + props.gridSubsteps &&
          ` Continue adding diagonals for the left side, bottom to top: ${props.currentSolutionStep.totalsLeft
            .slice()
            .reverse()
            .join(", ")}`}
        {props.currentStep === 6 + props.gridSubsteps &&
          ` Write out the solution: ${props.solution.join("")}`}
      </Box>
    </>
  );
};

function LatticeSolutionSteps({
  multiplicand,
  multiplier,
}: LatticeSolutionStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gridSubsteps, setGridSubsteps] = useState(0);
  const [isAllStepsMode, setIsAllStepsMode] = useState(false);

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
    for (let i = 0; i < 7 + gridSubsteps; i++) {
      const step: SolutionStep = {
        multiplicand:
          i >= 1
            ? multiplicandDigits
            : Array(multiplicandDigits.length).fill(undefined).map(Number),
        multiplier:
          i >= 2
            ? multiplierDigits
            : Array(multiplierDigits.length).fill(undefined).map(Number),
        totalsBottom: [],
        totalsLeft: [],
      };
      if (i >= 3) {
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
        }
      }
      if (i >= 4 + gridSubsteps) {
        step.totalsBottom = totalsBottom.slice();
      }
      if (i >= 5 + gridSubsteps) {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "j":
          handlePreviousClick();
          break;
        case "k":
          handlePlayPauseClick();
          break;
        case "l":
          handleNextClick();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlePreviousClick, handlePlayPauseClick, handleNextClick]);

  return (
    <Box>
      <Button onClick={() => setIsAllStepsMode(!isAllStepsMode)}>
        {isAllStepsMode ? "Show One Step" : "Show All Steps"}
      </Button>
      {isAllStepsMode ? (
        solutionSteps.map((step, index) => (
          <Box
            border="1px"
            borderColor="gray.300"
            marginTop={4}
            borderRadius={4}
            key={index}
          >
            <SolutionStepView
              multiplicand={step.multiplicand}
              multiplier={step.multiplier}
              currentStep={index}
              currentSolutionStep={step}
              solution={solution}
              gridSubsteps={gridSubsteps}
            ></SolutionStepView>
          </Box>
        ))
      ) : (
        <>
          <Flex direction="row" justify="left" mt={4} gap={3}>
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

          <SolutionStepView
            multiplicand={multiplicand}
            multiplier={multiplier}
            currentStep={currentStep}
            currentSolutionStep={solutionSteps[currentStep]}
            solution={solution}
            gridSubsteps={gridSubsteps}
          ></SolutionStepView>
        </>
      )}
    </Box>
  );
}

export default LatticeSolutionSteps;

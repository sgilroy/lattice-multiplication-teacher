import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaFastForward,
  FaPause,
  FaPlay,
  FaShare,
  FaStepBackward,
  FaStepForward,
  FaUndo,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { STEPS, SolutionStepView } from "./SolutionStepView";

interface LatticeSolutionStepsProps {
  multiplicand: number;
  multiplier: number;
}

export interface Diagonal {
  carry?: number;
  gridDigits: number[];
  sum: number;
  sumDigits: number[];
}

export interface SolutionStep {
  carryTop: number[];
  carryRight: number[];
  diagonals: Diagonal[];
  multiplicand: number[];
  multiplier: number[];
  lattice?: number[][][];
  totalsBottom: number[];
  totalsLeft: number[];
}

function LatticeSolutionSteps({
  multiplicand,
  multiplier,
}: LatticeSolutionStepsProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gridSubsteps, setGridSubsteps] = useState(0);
  const [diagonalSubsteps, setDiagonalSubsteps] = useState(0);
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

    // add up the diagonals, starting from the bottom right
    const totalsBottom = [];
    const totalsLeft = [];
    const carryRight = [];
    const carryTop = [];
    const diagonals: Diagonal[] = [];
    // imagine extending the diagonals beyond the grid so that every diagonal has the same length, and there are m + n diagonals
    for (
      let i = 0;
      i < multiplicandDigits.length + multiplierDigits.length;
      i++
    ) {
      const diagonal: Diagonal = { gridDigits: [], sumDigits: [], sum: 0 };
      if (i > 0) {
        diagonal.carry = diagonals[i - 1].sumDigits[0];
      }

      let sum = 0;
      // start with the appropriate carry digit
      if (i < multiplierDigits.length) {
        sum = carryRight[0] ? carryRight[0] : 0;
      } else {
        sum = carryTop[0];
      }

      // j is the index within the diagonal, upper right to lower left
      for (
        let j = 0;
        j <= Math.max(multiplicandDigits.length, multiplierDigits.length);
        j++
      ) {
        const row = j;
        const col =
          multiplicandDigits.length + multiplierDigits.length - 1 - i - j;
        // start with the tens digit in grid cell [col, row]

        // add the tens digit of the current cell, if it exists
        if (
          row < multiplierDigits.length &&
          row >= 0 &&
          col < multiplicandDigits.length &&
          col >= 0
        ) {
          const tensDigit = lattice[col][row][0];
          sum += tensDigit;
          diagonal.gridDigits.push(tensDigit);
        }

        // add the ones digit of the cell to the left, if it exists
        if (
          row < multiplierDigits.length &&
          row >= 0 &&
          col - 1 < multiplicandDigits.length &&
          col - 1 >= 0
        ) {
          const onesDigit = lattice[col - 1][row][1];
          sum += onesDigit;
          diagonal.gridDigits.push(onesDigit);
        }
      }
      diagonal.sum = sum;
      const digit = sum % 10;
      const carry = Math.floor(sum / 10);
      diagonal.sumDigits.push(carry);
      diagonal.sumDigits.push(digit);
      if (i < multiplicandDigits.length) {
        totalsBottom.unshift(digit);
      } else {
        totalsLeft.unshift(digit);
      }

      if (i < multiplierDigits.length - 1) {
        carryRight.unshift(carry);
      } else if (carryTop.length < multiplicandDigits.length) {
        carryTop.unshift(carry);
      }
      diagonals.push(diagonal);
    }

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
    const diagonalSubsteps =
      multiplicandDigits.length + multiplierDigits.length;
    setDiagonalSubsteps(diagonalSubsteps);
    for (
      let stepIndex = 0;
      stepIndex < STEPS.WRITE_SOLUTION + gridSubsteps + diagonalSubsteps;
      stepIndex++
    ) {
      const step: SolutionStep = {
        multiplicand:
          stepIndex >= STEPS.WRITE_MULTIPLICAND
            ? multiplicandDigits
            : Array(multiplicandDigits.length).fill(undefined).map(Number),
        multiplier:
          stepIndex >= STEPS.WRITE_MULTIPLIER
            ? multiplierDigits
            : Array(multiplierDigits.length).fill(undefined).map(Number),
        carryTop: [],
        carryRight: [],
        totalsBottom: [],
        totalsLeft: [],
        diagonals: [],
      };
      if (stepIndex >= STEPS.DRAW_GRID) {
        step.lattice = multiplicandDigits.map(() =>
          multiplierDigits.map(() => [NaN, NaN])
        );
        // sub steps
        for (
          let substepIndex = 0;
          substepIndex < Math.min(stepIndex - STEPS.DRAW_GRID, gridSubsteps);
          substepIndex++
        ) {
          const row = substepIndex % multiplierDigits.length;
          const col = Math.floor(substepIndex / multiplierDigits.length);
          const product = multiplicandDigits[col] * multiplierDigits[row];
          step.lattice[col][row][0] = Math.floor(product / 10);
          step.lattice[col][row][1] = product % 10;
        }
      }
      if (stepIndex >= STEPS.MULTIPLY_DIGITS + gridSubsteps) {
        // sub steps
        for (
          let substepIndex = 0;
          substepIndex <
          Math.min(
            stepIndex - STEPS.DRAW_GRID - gridSubsteps,
            diagonalSubsteps
          );
          substepIndex++
        ) {
          const carryRightCount =
            2 + Math.min(substepIndex, multiplierDigits.length - 2);
          const carryTopCount = Math.min(
            substepIndex - carryRightCount + 2,
            multiplicandDigits.length
          );
          for (let i = 0; i < carryRightCount; i++) {
            step.carryRight[multiplierDigits.length - 1 - i] =
              carryRight[multiplierDigits.length - 1 - i];
          }
          for (let i = 0; i < carryTopCount; i++) {
            step.carryTop[multiplicandDigits.length - 1 - i] =
              carryTop[multiplicandDigits.length - 1 - i];
          }
          step.diagonals = diagonals.slice(0, substepIndex + 1);

          // incrementally fill in the totals digits from right (end of the array) to left (beginning of the array) acccording to the substepIndex
          const totalsBottomCount = Math.min(
            substepIndex + 1,
            multiplicandDigits.length
          );
          step.totalsBottom = Array(
            multiplicandDigits.length - totalsBottomCount
          )
            .fill(undefined)
            .map(Number)
            .concat(
              totalsBottom.slice(
                multiplicandDigits.length - totalsBottomCount,
                multiplicandDigits.length
              )
            );

          const totalsLeftCount = Math.min(
            substepIndex + 1 - totalsBottomCount,
            multiplierDigits.length
          );
          step.totalsLeft = Array(multiplierDigits.length - totalsLeftCount)
            .fill(undefined)
            .map(Number)
            .concat(
              totalsLeftPadded.slice(
                multiplierDigits.length - totalsLeftCount,
                multiplierDigits.length
              )
            );
        }
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modeQueryParam = queryParams.get("mode");
  const stepQueryParam = queryParams.get("step");

  useEffect(() => {
    if (modeQueryParam === "all") {
      setIsAllStepsMode(true);
    } else if (modeQueryParam === "one") {
      setIsAllStepsMode(false);
    }

    if (stepQueryParam) {
      const step = parseInt(stepQueryParam) - 1;
      if (!isNaN(step) && step >= 0 && step < solutionSteps.length) {
        setCurrentStep(step);
      }
    }
  }, [modeQueryParam, stepQueryParam, solutionSteps.length]);

  const handleShareClick = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      a: multiplicand.toString(),
      b: multiplier.toString(),
      mode: isAllStepsMode ? "all" : "one",
    });
    if (!isAllStepsMode) {
      params.set("step", (currentStep + 1).toString());
    }
    const url = `${baseUrl}?${params.toString()}`;
    navigator.clipboard.writeText(url);
  };
  return (
    <Box>
      <Flex direction="row" gap={3}>
        <Button onClick={() => setIsAllStepsMode(!isAllStepsMode)}>
          {t(
            isAllStepsMode ? "showOneStep" : "showAllSteps",
            isAllStepsMode ? "Show One Step" : "Show All Steps"
          )}
        </Button>
        <IconButton
          aria-label={t("share", "Share")}
          icon={<FaShare />}
          onClick={handleShareClick}
        />
      </Flex>
      {isAllStepsMode ? (
        solutionSteps.map((step, index) => (
          <Box
            border="1px"
            borderColor="gray.300"
            marginTop={4}
            borderRadius={4}
            padding={4}
            key={index}
          >
            <SolutionStepView
              multiplicand={multiplicand}
              multiplier={multiplier}
              currentStep={index}
              currentSolutionStep={step}
              solution={solution}
              gridSubsteps={gridSubsteps}
              diagonalSubsteps={diagonalSubsteps}
            ></SolutionStepView>
          </Box>
        ))
      ) : (
        <Flex direction="column" gap={3}>
          <Flex direction="row" justify="left" mt={4} gap={3}>
            <IconButton
              aria-label={t("reset", "Reset")}
              icon={<FaUndo />}
              onClick={handleResetClick}
              isDisabled={currentStep === 0}
            />
            <IconButton
              aria-label={t("previous", "Previous")}
              icon={<FaStepBackward />}
              onClick={handlePreviousClick}
              isDisabled={currentStep === 0 || isPlaying}
            />
            <IconButton
              aria-label={t(
                isPlaying ? "pause" : "play",
                isPlaying ? "Pause" : "Play"
              )}
              icon={isPlaying ? <FaPause /> : <FaPlay />}
              onClick={handlePlayPauseClick}
              isDisabled={currentStep === solutionSteps.length - 1}
            />
            <IconButton
              aria-label={t("next", "Next")}
              icon={<FaStepForward />}
              onClick={handleNextClick}
              isDisabled={currentStep === solutionSteps.length - 1 || isPlaying}
            />
            <IconButton
              aria-label={t("jumpToLastStep", "Jump to last step")}
              icon={<FaFastForward />}
              onClick={() => setCurrentStep(solutionSteps.length - 1)}
              isDisabled={currentStep === solutionSteps.length - 1 || isPlaying}
            />
          </Flex>

          <SolutionStepView
            multiplicand={multiplicand}
            multiplier={multiplier}
            currentStep={currentStep}
            currentSolutionStep={solutionSteps[currentStep]}
            solution={solution}
            gridSubsteps={gridSubsteps}
            diagonalSubsteps={diagonalSubsteps}
          ></SolutionStepView>
        </Flex>
      )}
    </Box>
  );
}

export default LatticeSolutionSteps;

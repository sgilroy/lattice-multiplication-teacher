import { Box, Flex, Text } from "@chakra-ui/react";
import LatticeGrid from "./LatticeGrid";
import { SolutionStep } from "./LatticeSolutionSteps";
import { useTranslation } from "react-i18next";

export enum STEPS {
  MAKE_SPACE,
  WRITE_MULTIPLICAND,
  WRITE_MULTIPLIER,
  DRAW_GRID,
  MULTIPLY_DIGITS,
  ADD_BOTTOM_TOTALS,
  ADD_LEFT_TOTALS,
  WRITE_SOLUTION,
}

export type SolutionStepViewProps = {
  currentStep: number;
  gridSubsteps: number;
  currentSolutionStep: SolutionStep;
  multiplicand: number;
  multiplier: number;
  solution: number[];
};

export const SolutionStepView = ({
  currentStep,
  gridSubsteps,
  currentSolutionStep,
  multiplicand,
  multiplier,
  solution,
}: SolutionStepViewProps) => {
  const { t } = useTranslation();

  const isGridSubstep =
    currentStep >= STEPS.MULTIPLY_DIGITS &&
    currentStep < STEPS.MULTIPLY_DIGITS + gridSubsteps;
  const colIndex =
    currentSolutionStep &&
    Math.floor(
      (currentStep - STEPS.MULTIPLY_DIGITS) /
        currentSolutionStep.multiplier.length
    );
  const rowIndex =
    currentSolutionStep &&
    (currentStep - STEPS.MULTIPLY_DIGITS) %
      currentSolutionStep.multiplier.length;
  const row =
    isGridSubstep &&
    currentSolutionStep.lattice &&
    currentSolutionStep.lattice[colIndex];
  const digits = isGridSubstep && row && row[rowIndex];

  return (
    <>
      {currentSolutionStep && (
        <LatticeGrid
          multiplicand={currentSolutionStep.multiplicand}
          multiplier={currentSolutionStep.multiplier}
          lattice={currentSolutionStep.lattice}
          totalsBottom={currentSolutionStep.totalsBottom}
          totalsLeft={currentSolutionStep.totalsLeft}
        />
      )}
      <Box fontSize="lg" mt={4}>
        <Text fontWeight="bold">
          {t("step")} {currentStep + 1}:
        </Text>
        {currentStep === STEPS.MAKE_SPACE && ` ${t("makeSpace")}`}
        {currentStep === STEPS.WRITE_MULTIPLICAND &&
          ` ${t("writeMultiplicand")} ${multiplicand} ${t("alongTheTop")}`}
        {currentStep === STEPS.WRITE_MULTIPLIER &&
          ` ${t("writeMultiplier")} ${multiplier} ${t("alongTheRightSide")}`}
        {currentStep === STEPS.DRAW_GRID && ` ${t("drawGrid")}`}
        {isGridSubstep && (
          <>
            {t("multiplyDigits")}
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
        {currentStep === STEPS.ADD_BOTTOM_TOTALS + gridSubsteps - 1 &&
          ` ${t("addBottomTotals")} ${currentSolutionStep.totalsBottom
            .slice()
            .reverse()
            .join(", ")}`}
        {currentStep === STEPS.ADD_LEFT_TOTALS + gridSubsteps - 1 &&
          ` ${t("addLeftTotals")} ${currentSolutionStep.totalsLeft
            .slice()
            .reverse()
            .join(", ")}`}
        {currentStep === STEPS.WRITE_SOLUTION + gridSubsteps - 1 &&
          ` ${t("writeSolution")} ${solution.join("")}`}
      </Box>
    </>
  );
};

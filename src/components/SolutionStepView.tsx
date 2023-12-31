import { Box, Flex, Text } from "@chakra-ui/react";
import LatticeGrid from "./LatticeGrid";
import { Diagonal, SolutionStep } from "./LatticeSolutionSteps";
import { useTranslation } from "react-i18next";

export enum STEPS {
  MAKE_SPACE,
  DRAW_GRID,
  WRITE_MULTIPLICAND,
  WRITE_MULTIPLIER,
  MULTIPLY_DIGITS,
  WRITE_SOLUTION,
}

export type SolutionStepViewProps = {
  currentStep: number;
  gridSubsteps: number;
  diagonalSubsteps: number;
  currentSolutionStep: SolutionStep;
  multiplicand: number;
  multiplier: number;
  solution: number[];
};

export const SolutionStepView = ({
  currentStep,
  gridSubsteps,
  diagonalSubsteps,
  currentSolutionStep,
  multiplicand,
  multiplier,
  solution,
}: SolutionStepViewProps) => {
  const { t } = useTranslation();

  const isGridSubstep =
    currentStep >= STEPS.MULTIPLY_DIGITS &&
    currentStep < STEPS.MULTIPLY_DIGITS + gridSubsteps;

  const isDiagonalSubstep =
    currentStep >= STEPS.MULTIPLY_DIGITS + gridSubsteps &&
    currentStep < STEPS.MULTIPLY_DIGITS + gridSubsteps + diagonalSubsteps;

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
  const gridCellDigits = isGridSubstep && row && row[rowIndex];
  const diagonal: Diagonal | undefined = isDiagonalSubstep
    ? currentSolutionStep.diagonals[
        currentStep - STEPS.MULTIPLY_DIGITS - gridSubsteps
      ]
    : undefined;
  const addends = diagonal && diagonal.gridDigits.slice();
  if (addends && diagonal && diagonal.carry !== undefined) {
    addends.unshift(diagonal.carry);
  }

  return (
    <>
      {currentSolutionStep && (
        <LatticeGrid
          multiplicand={currentSolutionStep.multiplicand}
          multiplier={currentSolutionStep.multiplier}
          carryTop={currentSolutionStep.carryTop}
          carryRight={currentSolutionStep.carryRight}
          lattice={currentSolutionStep.lattice}
          totalsBottom={currentSolutionStep.totalsBottom}
          totalsLeft={currentSolutionStep.totalsLeft}
        />
      )}
      <Box fontSize="lg">
        <Text fontWeight="bold">
          {t("step")} {currentStep + 1}:
        </Text>
        {currentStep === STEPS.MAKE_SPACE && ` ${t("makeSpace")}`}
        {currentStep === STEPS.WRITE_MULTIPLICAND &&
          ` ${t("writeMultiplicand", { multiplicand })}`}
        {currentStep === STEPS.WRITE_MULTIPLIER &&
          ` ${t("writeMultiplier", { multiplier })}`}
        {currentStep === STEPS.DRAW_GRID &&
          ` ${t("drawGrid", {
            columns: currentSolutionStep.multiplicand.length,
            multiplicand,
            rows: currentSolutionStep.multiplier.length,
            multiplier,
          })}`}
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
                {gridCellDigits && gridCellDigits[0]}
                {gridCellDigits && gridCellDigits[1]}
              </Text>
            </Flex>
          </>
        )}
        {isDiagonalSubstep && diagonal && addends && (
          <>
            {t("addDiagonalDigits")}
            <br />
            <Flex direction="row" key={colIndex} gap={1} ml={4}>
              <Text fontSize="sm" fontWeight="bold">
                {addends.join(" + ")} ={" "}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {diagonal.sum}
              </Text>
            </Flex>
          </>
        )}
        {currentStep ===
          STEPS.WRITE_SOLUTION + gridSubsteps + diagonalSubsteps - 1 &&
          ` ${t("writeSolution")} ${solution.join("")}`}
      </Box>
    </>
  );
};

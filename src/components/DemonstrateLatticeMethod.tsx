import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaRandom, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LatticeSolutionSteps from "./LatticeSolutionSteps";
import i18n from "../i18n";

function DemonstrateLatticeMethod() {
  const [multiplicand, setMultiplicand] = useState<number | "">(321);
  const [multiplier, setMultiplier] = useState<number | "">(12);
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box p={4}>
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        mb={4}
        gap={3}
      >
        <Flex direction="row" width="100%" gap={3}>
          <Text fontSize="xl" fontWeight="bold" mr={2}>
            {t("multiply")}
          </Text>
          <Spacer />
          <Menu>
            <MenuButton as={Button} aria-label={t("language")}>
              {t("currentLanguage")}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => changeLanguage("en")}>
                {t("english")}
              </MenuItem>
              <MenuItem onClick={() => changeLanguage("fr")}>
                {t("french")}
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            aria-label={t("toggleColorMode")}
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Flex>
        <Flex direction="row" align="center">
          <IconButton
            aria-label={t("randomize")}
            icon={<FaRandom />}
            onClick={handleRandomize}
            mr={2}
          />
          <Input
            placeholder={t("multiplicandPlaceholder")}
            value={multiplicand}
            onChange={(e) =>
              setMultiplicand(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
            mr={2}
          />
          <Text fontWeight="bold" mr={2}>
            x
          </Text>
          <Input
            placeholder={t("multiplierPlaceholder")}
            value={multiplier}
            onChange={(e) =>
              setMultiplier(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
            mr={2}
          />
        </Flex>
      </Flex>
      {multiplicand !== "" && multiplier !== "" && (
        <LatticeSolutionSteps
          multiplicand={multiplicand}
          multiplier={multiplier}
        />
      )}
    </Box>
  );
}

export default DemonstrateLatticeMethod;

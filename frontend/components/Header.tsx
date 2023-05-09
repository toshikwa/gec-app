import { ColorMode, IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  buttonDivStyle,
  headerStyle,
  subtitleStyle,
  titleDivStyle,
  titleStyle,
} from "./Header.css";
import { siteConfig } from "lib/config";

interface HeaderProps {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const Header = ({ colorMode, toggleColorMode }: HeaderProps) => {
  return (
    <header className={headerStyle}>
      <div className={titleDivStyle}>
        <h1 className={titleStyle}>{siteConfig.title}</h1>
        <p className={subtitleStyle}>{siteConfig.subtitle}</p>
      </div>
      <div className={buttonDivStyle}>
        <IconButton
          mb={10}
          aria-label="Toggle color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div>
    </header>
  );
};

export default Header;

import { headerStyle } from "./Header.css";
import { siteConfig } from "lib/config";

interface HeaderProps {}

const Header = ({}: HeaderProps) => (
  <header>
    <div className={headerStyle.container}>
      <h1 className={headerStyle.title}>{siteConfig.title}</h1>
      <p className={headerStyle.subtitle}>{siteConfig.subtitle}</p>
    </div>
  </header>
);

export default Header;

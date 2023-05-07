import { headerStyle } from "./Header.css";
import { siteConfig } from "lib/config";
import Link from "next/link";

interface HeaderProps {}

const Header = ({}: HeaderProps) => (
  <header>
    <Link className={headerStyle.container} href="/">
      <h1 className={headerStyle.title}>{siteConfig.title}</h1>
      <p className={headerStyle.subtitle}>{siteConfig.subtitle}</p>
    </Link>
  </header>
);

export default Header;

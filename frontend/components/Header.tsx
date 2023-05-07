import { headerStyle } from "./Header.css";
import { siteConfig } from "lib/config";
import Container from "./Container";
import Link from "next/link";

interface HeaderProps {}

const Header = ({}: HeaderProps) => (
  <header>
    <Container wide>
      <Link className={headerStyle.container} href="/">
        <h1 className={headerStyle.title}>{siteConfig.title}</h1>
        <p className={headerStyle.subtitle}>{siteConfig.subtitle}</p>
      </Link>
    </Container>
  </header>
);

export default Header;

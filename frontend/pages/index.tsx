import { useColorMode } from "@chakra-ui/react";
import { Container, Header, Meta, TextForm } from "components";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Container wide>
        <Meta />
        <Header colorMode={colorMode} toggleColorMode={toggleColorMode} />
        <TextForm colorMode={colorMode} />
      </Container>
    </>
  );
}

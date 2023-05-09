import "@/styles/globals.css";
import {
  extendTheme,
  ChakraProvider,
  type ThemeConfig,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const theme = extendTheme(config);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

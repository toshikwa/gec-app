import { useMemo } from "react";
import * as Diff from "diff";
import { addedStyle, removedStyle } from "./StringDiff.css";
import { ColorMode } from "@chakra-ui/react";

interface StringDiffProps {
  input: string;
  output: string;
  isLast: boolean;
  showRemoved: boolean;
  colorMode: ColorMode;
}

export const StringDiff = ({
  input,
  output,
  isLast,
  showRemoved,
  colorMode,
}: StringDiffProps) => {
  const result = useMemo(() => {
    const diff = Diff["diffWords"](input, output);
    return diff.map((part, index) => {
      if (!part.removed) {
        return (
          <span key={index} className={part.added ? addedStyle[colorMode] : ""}>
            {part.value}
          </span>
        );
      } else if (showRemoved) {
        return (
          <span key={index} className={removedStyle[colorMode]}>
            {part.value}
          </span>
        );
      }
    });
  }, [input, output, showRemoved, colorMode]);
  return (
    <>
      {result.map((r) => r)}
      {isLast || <br />}
    </>
  );
};

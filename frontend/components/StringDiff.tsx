import { useMemo } from "react";
import * as Diff from "diff";
import { addedStyle, removedStyle } from "./StringDiff.css";

interface StringDiffProps {
  input: string;
  output: string;
  isLast: boolean;
  showRemoved: boolean;
}

export const StringDiff = ({
  input,
  output,
  isLast,
  showRemoved,
}: StringDiffProps) => {
  const result = useMemo(() => {
    const diff = Diff["diffWords"](input, output);
    return diff.map((part, index) => {
      if (!part.removed) {
        return (
          <span key={index} className={part.added ? addedStyle : ""}>
            {part.value}
          </span>
        );
      } else if (showRemoved) {
        return (
          <span key={index} className={removedStyle}>
            {part.value}
          </span>
        );
      }
    });
  }, [input, output, showRemoved]);
  return (
    <>
      {result.map((r) => r)}
      {isLast || <br />}
    </>
  );
};

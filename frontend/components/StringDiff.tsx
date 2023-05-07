import { useMemo } from "react";
import * as Diff from "diff";
import { addedStyle } from "./StringDiff.css";

interface StringDiffProps {
  input: string;
  output: string;
  isLast: boolean;
}

export const StringDiff = ({ input, output, isLast }: StringDiffProps) => {
  const result = useMemo(() => {
    const diff = Diff["diffWords"](input, output);
    return diff
      .filter((part) => !part.removed)
      .map((part, index) => {
        return (
          <span
            key={`string-diff-${index}`}
            className={part.added ? addedStyle : ""}
          >
            {part.value}
          </span>
        );
      });
  }, [input, output]);
  return (
    <>
      {result.map((r) => r)}
      {isLast || <br />}
    </>
  );
};

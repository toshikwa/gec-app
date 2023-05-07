import { useMemo } from "react";
import * as Diff from "diff";

interface StringDiffProps {
  input: string;
  output: string;
  addedStyle: string;
}

export const StringDiff = ({ input, output, addedStyle }: StringDiffProps) => {
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
  return <>{result.map((r) => r)}</>;
};

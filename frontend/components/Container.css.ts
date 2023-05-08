import { style } from "@vanilla-extract/css";

const container = style({
  color: "var(--black)",
  width: "92%",
  margin: "0 auto",
});

export const containerStyle = {
  default: style([container, { maxWidth: "900px" }]),
  wide: style([container, { maxWidth: "1080px" }]),
};

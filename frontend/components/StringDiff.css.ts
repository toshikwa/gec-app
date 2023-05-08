import { style } from "@vanilla-extract/css";

export const addedStyle = style({
  backgroundColor: "var(--accent)",
  padding: ".1em",
});

export const removedStyle = style({
  textDecoration: "line-through",
  backgroundColor: "var(--secondary)",
  padding: ".1em",
});

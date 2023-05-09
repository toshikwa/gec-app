import { style } from "@vanilla-extract/css";

export const addedStyle = {
  light: style({
    backgroundColor: "var(--accent-light)",
    padding: ".1em",
  }),
  dark: style({
    backgroundColor: "var(--accent-dark)",
    padding: ".1em",
  }),
};

export const removedStyle = {
  light: style({
    textDecoration: "line-through",
    backgroundColor: "var(--secondary-light)",
    padding: ".1em",
  }),
  dark: style({
    textDecoration: "line-through",
    backgroundColor: "var(--secondary-dark)",
    padding: ".1em",
  }),
};

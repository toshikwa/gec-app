import { style } from "@vanilla-extract/css";

export const divStyle = style({
  display: "flex",
  justifyContent: "center",
});

export const headerStyle = style({
  color: "var(--black)",
  fontSize: "1.4rem",
  padding: "0 0.4rem",
  width: "50%",
  height: "2.7rem",
  fontWeight: "500",
});

export const formStyle = style({
  border: "0.5px solid var(--black)",
  color: "var(--black)",
  resize: "none",
  letterSpacing: ".001px",
  lineHeight: "1.6",
  fontSize: "1.2rem",
  fontWeight: "200",
  padding: "1.4rem 1.4rem",
  width: "50%",
  height: "24rem",
});

export const addedStyle = style({
  backgroundColor: "var(--accent)",
  padding: ".1em",
});

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
  fontSize: "1.1rem",
  fontWeight: "100",
  padding: "1.4rem 1.4rem",
  width: "50%",
  height: "24rem",
});

export const addedStyle = style({
  backgroundColor: "var(--accent)",
});

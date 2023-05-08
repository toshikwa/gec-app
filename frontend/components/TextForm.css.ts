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

export const buttonStyle = style({
  marginLeft: "0.8rem",
});

export const formStyle = style({
  fontFamily: "var(--chakra-fonts-body)",
  border: "0.5px solid var(--black)",
  color: "var(--black)",
  resize: "none",
  letterSpacing: ".001px",
  lineHeight: "1.6",
  fontSize: "1rem",
  fontWeight: "400",
  padding: "1.4rem 1.4rem",
  width: "50%",
  height: "24rem",
  overflow: "scroll",
});

import { style } from "@vanilla-extract/css";

export const headerStyle = style({
  display: "flex",
  justifyContent: "space-between",
});

export const titleDivStyle = style({
  margin: "2.5rem 0 3.2rem",
  textAlign: "left",
});

export const buttonDivStyle = style({
  margin: "auto 0",
  verticalAlign: "middle",
});

export const titleStyle = style({
  fontSize: "var(--site-title)",
  fontWeight: 500,
  letterSpacing: "0.1em",
  marginBottom: "0.2rem",
});

export const subtitleStyle = style({
  fontSize: "var(--site-subtitle)",
  fontWeight: 200,
  letterSpacing: "0.1em",
  marginTop: "0px",
});

import { style } from "@vanilla-extract/css";

export const headerStyle = {
  container: style({
    display: "block",
    margin: "2.5rem 0 3.2rem",
    textAlign: "left",
  }),
  title: style({
    fontSize: "var(--site-title)",
    fontWeight: 500,
    letterSpacing: "0.1em",
    marginBottom: "0.2rem",
  }),
  subtitle: style({
    fontSize: "var(--site-subtitle)",
    fontWeight: 200,
    letterSpacing: "0.1em",
    marginTop: "0px",
  }),
};

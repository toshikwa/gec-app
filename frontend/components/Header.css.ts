import { style } from "@vanilla-extract/css";

export const headerStyle = {
  container: style({
    display: "block",
    margin: "2.5rem 0 3.8rem",
    textAlign: "left",
    "@media": {
      "(hover: none)": {
        WebkitTapHighlightColor: "transparent",
        ":active": {
          color: "var(--gray-100)",
        },
      },
      "(hover: hover)": {
        ":hover": {
          color: "var(--gray-100)",
        },
      },
    },
  }),
  title: style({
    fontSize: "var(--site-title)",
    fontWeight: 500,
    letterSpacing: "0.1em",
    marginBottom: "0.6rem",
  }),
  subtitle: style({
    fontSize: "var(--site-subtitle)",
    fontWeight: 200,
    letterSpacing: "0.1em",
    marginTop: "0px",
  }),
};

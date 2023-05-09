import { style } from "@vanilla-extract/css";

export const textFormStyle = style({
  display: "flex",
  "@media": {
    "(max-width: 768px)": {
      display: "block",
    },
  },
  justifyContent: "center",
});

export const divStyle = style({
  display: "block",
  width: "50%",
  marginBottom: "1.8rem",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
    },
  },
});

export const headerStyle = style({
  color: "var(--black)",
  fontSize: "var(--heading3)",
  padding: "0 0.4rem",
  width: "100%",
  height: "2.7rem",
  fontWeight: "500",
});

export const buttonStyle = style({
  marginLeft: "0.8rem",
  "@media": {
    "(max-width: 768px)": {
      marginLeft: "0.5rem",
    },
  },
});

export const formStyle = style({
  display: "block",
  fontFamily: "var(--chakra-fonts-body)",
  border: "0.5px solid var(--black)",
  color: "var(--black)",
  fontSize: "var(--body)",
  resize: "none",
  letterSpacing: ".001px",
  lineHeight: "1.6",
  fontWeight: "400",
  padding: "1.4rem 1.4rem",
  width: "100%",
  height: "24rem",
  overflow: "scroll",
  "@media": {
    "(max-width: 768px)": {
      height: "15rem",
    },
  },
});

import React from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { Theme } from "../types";
import { transformText } from "../utils/TextTransform"; // Import your text transformation function

export interface Props {
  heading?: boolean;
  is_h1?: boolean;
  light?: boolean;
  children: any;
  color?: "text" | "primary" | "success" | "error" | "placeholder" | "white";
  justify?: boolean;
  small?: boolean;
}

const Text = (props: Props) => {
  const theme: Theme = useSelector(getTheme);

  // Set styles based on the props
  const styles = {
    color:
      props?.color === "white"
        ? "aliceblue"
        : props?.color === "primary"
        ? theme?.name === "light"
          ? theme?.primary
          : "orange"
        : props?.color === "success"
        ? theme?.success
        : props?.color === "error"
        ? theme?.error
        : props?.color === "placeholder"
        ? theme?.placeholder
        : theme?.text,
    fontFamily: "poppins",
    fontWeight: props?.heading ? "bold" : "normal",
    fontSize: props?.is_h1 ? "24px" : props?.small ? "10.5px" : "12px",
    lineHeight: !props?.is_h1 ? "1.8" : "1.5",
    textAlign: props?.justify ? "justify" : "start",
  };

  return (
    <span
      style={{
        color:
        props?.color == "white"
        ?
        "aliceblue"
        :
          props?.color == "primary"
            ? theme?.name == "light" ? theme?.primary : "orange"
            : props?.color == "success"
            ? theme?.success
            : props?.color == "error"
            ? theme?.error
            : props?.color == "placeholder"
            ? theme?.placeholder
            // : props?.light
            // ? theme?.paper
            : theme?.text,
        fontFamily: "poppins",
        fontWeight: props?.heading ? "bold" : "normal",
        fontSize: props?.is_h1 ? 24 : props?.small ? 10.5 : 12,
        lineHeight: !props?.is_h1 ? 1.8 : 1.5,
        textAlign: props?.justify ? "justify" : "start"
      }}
      // Use dangerouslySetInnerHTML to render the HTML safely, keeping the styles intact
      dangerouslySetInnerHTML={{
        __html: transformText(props?.children), // Apply the transformation to the children
      }}
    />
  );
};

export default Text;

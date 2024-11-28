import React from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { Theme } from "../types";

export interface Props {
  heading?: boolean;
  is_h1?: boolean;
  light?: boolean;
  children: any;
  color?: "text" | "primary" | "success" | "error" | "placeholder" | "white";
  justify?: boolean
  small: boolean
}

const text = (props: Props) => {
  const theme: Theme = useSelector(getTheme);

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
        fontSize: props?.is_h1 ? 24 : props?.small ? 10.5 : 12.5,
        lineHeight: !props?.is_h1 ? 1.8 : 1.5,
        textAlign: props?.justify ? "justify" : "start"
      }}
    >
      {props?.children}
    </span>
  );
};

export default text;

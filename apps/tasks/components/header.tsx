import React from "react";
import Text from "./text";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { FaCirclePlus } from "react-icons/fa6";
import { Theme } from "../types";

export interface Props {
  heading?: string;
  count?: number;
  setOpen: (state: boolean) => void;
  title: string;
}

const header = (props: Props) => {
  const { state } = useLocation();
  const theme:Theme = useSelector(getTheme);

  return (
    <div style={{ background: theme?.paper, padding: 20, borderRadius: 10 }}>
      {state?.row["name"] && (
        <>
          <Text heading is_h1>
            {state?.row["name"]}
          </Text>
          <br />
          <Text>controlled by {state?.row["admin_email"]}</Text>
          <br />
          <br />
        </>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: innerWidth > 768 && theme?.pale,
          padding:innerWidth > 768 ? 20 : 0,
          borderRadius: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{props?.heading}</Text>
          <div style={{ margin: "0 5px" }} />
          <div
            style={{
              background: theme?.error,
              height: 30,
              width: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "100%",
            }}
          >
            <Text color="white">{props?.count}</Text>
          </div>
        </div>
        {/* add company button  */}
        <div>
          <div
            onClick={() => props?.setOpen(true)}
            style={{
              background: theme?.primary,
              padding: "10px 20px",
              borderRadius: "100px",
              boxShadow: "5px 5px 20px rgba(0,0,0,.1)",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <FaCirclePlus color={theme?.name == "dark" ? theme?.text : theme?.paper} size={15} />
            <div style={{ margin: "0 5px" }} />
            <Text color={theme?.name == "dark" ? theme?.text : theme?.paper}>add {props?.title}</Text>
          </div>
        </div>
        {/* end add company button  */}
      </div>
    </div>
  );
};

export default header;

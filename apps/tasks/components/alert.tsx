import React from "react";
import { Alert, Theme } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setAlert } from "../model/data";
import Text from "./text";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

const alert = (props: Alert) => {
  const theme: Theme = useSelector(getTheme);

  const dispatch = useDispatch();

  return (
    <AnimatePresence mode="sync">
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.1)",
          backdropFilter: "blur(3px)",
        }}
      >
        <motion.div
          initial={{
            y: -100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: -100,
            opacity: 0,
          }}

          style={{
            position: "absolute",
            top: "1%",
            left: "35%",
            background: theme?.paper,
            boxShadow:
              "10px 10px 20px rgba(0,0,0,.05), -10px -10px 20px rgba(0,0,0,.05)",
            width: "30vw",
            borderRadius: "10px",
            padding: 20,
          }}
        >
          {/* header  */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 15,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {props?.mode == "success" ? (
                  <FaCheckCircle
                    color={theme?.success}
                    style={{ marginRight: 10 }}
                    size={20}
                  />
                ) :  props?.mode == "error" ? (
                  <FaX
                    color={theme?.error}
                    style={{ marginRight: 10 }}
                    size={16}
                  />
                )
              :
              <FaBell
                    color={theme?.text}
                    style={{ marginRight: 10 }}
                    size={16}
                  />

              }
                <Text color={props?.mode == "success" ? "success" : props?.mode == "error" ? "error" : "text"}>
                  {props?.title}
                </Text>
              </div>

              {/* close button  */}
              <div
                onClick={() =>
                  dispatch(setAlert({ title: "", body: "", mode: "" }))
                }
                style={{
                  background: theme?.pale,
                  padding: "10px 20px",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Text>close</Text>
              </div>
            </div>
          </div>

          {/* about  */}
          <div>
            {/* <br /> */}
            {/* <Text primary>{props?.title}</Text> */}
            {/* <br /> */}
            {/* <br /> */}
            <Text>{props?.body}</Text>
          </div>

          {/* buttons  */}
          <div style={{ display: 'flex', marginTop: 10, justifyContent: "flex-end"}}>
          {
            props?.buttons && props?.buttons[0]
          }
          </div>
          <div>{/* button iteration  */}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default alert;

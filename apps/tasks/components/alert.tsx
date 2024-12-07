import React, { useEffect, useRef } from "react";
import { Alert, Theme } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { allowHide, disableHide, getTheme, setAlert } from "../model/data";
import Text from "./text";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./button";
import { IoClose } from "react-icons/io5";

const AlertComponent = (props: Alert) => {
  const theme: Theme = useSelector(getTheme);
  const dispatch = useDispatch();

  // Create a ref for the alert container
  const alertRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the alert container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
        dispatch(setAlert({ title: "", body: "", mode: "" }));  // Close the alert if clicked outside
        dispatch(allowHide());  // Allow alert hiding after click
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  return (
    <AnimatePresence mode="sync">
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <motion.div
          ref={alertRef}  // Attach ref to alert container
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          style={{
            position: "absolute",
            top: "1%",
            left: innerWidth > 768 ? "35%" : "5%",
            background: theme?.paper,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05), -10px -10px 20px rgba(0,0,0,.05)",
            width: innerWidth > 768 ? "30vw" : "80vw",
            borderRadius: "3px",
            padding: 20,
          }}
        >
          {/* Header */}
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
                {props?.mode === "success" ? (
                  <FaCheckCircle color={theme?.success} style={{ marginRight: 10 }} size={20} />
                ) : props?.mode === "error" ? (
                  <FaX color={theme?.error} style={{ marginRight: 10 }} size={16} />
                ) : (
                  <FaBell color={theme?.text} style={{ marginRight: 10 }} size={16} />
                )}
                <Text color={props?.mode === "success" ? "success" : props?.mode === "error" ? "error" : "text"}>
                  {props?.title}
                </Text>
              </div>

              {/* Close button */}
              <div
                onClick={() => {
                  dispatch(setAlert({ title: "", body: "", mode: "" }));
                  dispatch(allowHide());
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <IoClose color={theme?.placeholder} size={20} />
              </div>
            </div>
          </div>

          {/* Body */}
          <div>
            <Text>{props?.body}</Text>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              marginTop: 5,
              justifyContent: "flex-end",
            }}
          >
            {props?.title === "Weak password" ? (
              <Button
                contain
                onClick={() => {
                  dispatch(setAlert({ title: "", body: "", mode: "" }));
                  dispatch(allowHide());
                }}
                title={"I've understood"}
                loading={false}
              />
            ) : (
              props?.buttons && props?.buttons[0]
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertComponent;

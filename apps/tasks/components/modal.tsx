import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Theme } from "../types";
import { getTheme } from "../model/data";
import { AnimatePresence, motion } from "framer-motion";
import Text from "../components/text";
import { IoClose } from "react-icons/io5";

export interface ModalProps {
  open: boolean;
  setOpen: any;
  content: any;
  title: string;
}

const Modal = (props: ModalProps) => {
  const theme: Theme = useSelector(getTheme);
  
  // Create a ref for the modal content area to detect clicks outside
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        props.setOpen(false);  // Close the modal if clicked outside
      }
    };

    // Attach event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0,0,0,.4)",
          display: "flex",
          backdropFilter: "blur(6px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Modal content */}
        <motion.div
          ref={modalRef}  // Attach the ref to this div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: theme?.paper,
            maxHeight: innerWidth < 768 ? "65vh" : "90vh",
            overflowY: "scroll",
            padding: 20,
            width: innerWidth > 768 ? "30vw" : "80vw",
            borderRadius: 2,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text color="placeholder">{props?.title}</Text>

            {/* Close button */}
            <div
              onClick={() => props?.setOpen(false)}
              style={{
                cursor: "pointer",
              }}
            >
              <IoClose size={20} color={theme?.placeholder} />
            </div>
          </div>

          {/* Modal Body */}
          <div style={{ marginTop: 10, width: "100%" }}>{props?.content}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;

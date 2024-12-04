import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { Theme } from "../types";
import { motion } from "framer-motion";

export interface Props {
  rows?: any[];
  row?: object;
  setActive?: (active: boolean) => void;
  is_active?: boolean;
  toggle: any;
}

const Switch = (props: Props) => {
  const theme: Theme = useSelector(getTheme);

  const [isActive, setIsActive] = useState(false);
  const [positionX, setPositionX] = useState(0);
  

  useEffect(() => {
    if (isActive) {
      setPositionX(20);
    } else {
      setPositionX(0);
    }
  }, [isActive]);

  useEffect(() => {
    props?.setActive && props?.setActive(isActive);
  }, [isActive]);

  useEffect(() => {
    setIsActive(props?.is_active);
  }, []);

  // useEffect(()=>{

  //   if(props?.toggle){
  //     if(props?.row["is_active"] != isActive){
  //       props?.toggle(props?.row["id"], isActive)
  //     }
  //   }

  // }, [isActive])

  useEffect(()=>{

    setIsActive(props?.is_active)

  }, [props?.is_active])

  return (
    // track
    <div
      onClick={() => {
        setIsActive(!isActive);
        props?.toggle && props?.toggle(props?.row["id"], !isActive);
      }}
      style={{
        width: 40,
        height: 20,
        cursor: "pointer",
        border:theme?.name == "dark" ? "1px solid grey":"none",
        background:
          theme?.name == "dark"
            ? !isActive
              ? "rgba(0,0,0,.1)"
              : theme?.primary
            : !isActive
            ? "rgba(0,0,0,.1)"
            : "rgba(255,110, 0, .2)",
        borderRadius: "100px",
      }}
    >
      {/* thumb  */}
      <motion.div
        animate={{ x: positionX }}
        style={{
          width: 20,
          height: 20,
          x: positionX,
          // border: "1px solid grey",
          background: theme?.name == "dark"? isActive ? theme?.text : "rgb(50,50,50)" : isActive ? theme?.primary : theme?.placeholder,
          // background: isActive ? theme?.text : theme?.primary,
          borderRadius: "100%",
          // borderRadius: "100%",
        }}
      />
    </div>
  );
};

export default Switch;

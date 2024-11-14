import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaLock, FaPhone, FaRegEyeSlash, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { Theme } from "../types";

const input = ({ input, type, placeholder, setter, fullwidth, noBorder,zeroMargin, large }) => {
  const theme: Theme = useSelector(getTheme);
  const [hide, setHide] = useState(false)

  useEffect(()=>{

    if(type == "password"){
      setHide(true)
    }

  },[])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: theme?.pale,
        width: fullwidth ? "90%": "max-content",
        marginBottom:zeroMargin ? 0 : 10,
        padding: 15,
        borderRadius: 2,
        // borderBottom:noBorder ? "none": "1px solid " + theme?.primary,
      }}
    >
      {
        placeholder == "contact"
        ?
        <FaPhone style={{rotate: "90deg"}} color={theme?.placeholder} size={20} />
        :
      type == "search"
      ?
      <FaSearch color={theme?.placeholder} size={20} />
:
      type == "email" ? (
        <FaEnvelope color={theme?.placeholder} size={20} />
      ) : type == "password" ? (
        <FaLock color={theme?.placeholder} />
      ) : (
        ""
      )}
      {

        large
        ?
        <textarea 
        value={input.value}
        minLength={4}
        placeholder={placeholder}
        onChange={(e) => setter({ ...input, value: e.target.value })}
        required
        name="" id="" rows={5} style={{
          margin: "0 10px",
          color: theme?.text,
          background: "transparent",
          width: "100%",
          border: "none",
          outline: "none",
          fontFamily: "poppins",
          fontSize: 12.5
        }}></textarea>
        :
      <input
        required
        style={{
          margin: "0 10px",
          color: theme?.text,
          background: "transparent",
          width: "100%",
          border: "none",
          outline: "none",
          fontFamily: "poppins",
          fontSize: 12.5,
          colorScheme: theme?.name =="light" ? "light" : "dark"
        }}
        value={input.value}
        type={type == "password" ? hide ? "password" : "text" : type}
        minLength={4}
        placeholder={placeholder}
        onChange={(e) => setter({ ...input, value: e.target.value })}
      />
      }
      {
        type == "password"
        ?
        !hide
        ?
        <FaEye style={{cursor: "pointer"}} color={theme?.text} onClick={()=>setHide(true)}/>
        :
        <FaRegEyeSlash style={{cursor: "pointer"}} color={theme?.text} onClick={()=>setHide(false)}/>
        :
        ""
      }
    </div>
  );
};

export default input;

import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaLock, FaPhone, FaRegEyeSlash, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { Theme } from "../types";
import { FaPenClip, FaUser } from "react-icons/fa6";

const input = ({ input, type, placeholder, setter, fullwidth, noBorder,zeroMargin, large, rounded }) => {
  const theme: Theme = useSelector(getTheme);
  const [hide, setHide] = useState(false)

  const [BColor, setBColor] = useState("rgba(0,0,0,0)")

  useEffect(()=>{

    if(type == "password"){
      setHide(true)
    }

  },[])

  return (
    <div
      onFocus={()=>setBColor(theme?.primary)}
      onBlur={()=>setBColor("rgba(0,0,0,0)")}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: theme?.pale,
        width: fullwidth ? "90%": "max-content",
        marginBottom:zeroMargin ? 0 : 10,
        padding: 15,
        borderRadius: 2,
        border: "1px solid " + BColor,
        transition: ".3s"
        
      }}
    >
      {
        placeholder == "first name" || placeholder == "last name"
        ?
        <FaUser color={theme?.placeholder} size={17.5} />
        :
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

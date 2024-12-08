import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import { useLocation, useNavigate } from 'react-router-dom'
import { Theme } from '../types'
import { useSelector } from 'react-redux'
import { getTheme } from '../model/data'
import Text from "./text"

const navbar_link = ({option}) => {

  const {pathname} = useLocation()
  const theme:Theme = useSelector(getTheme)
  const navigate = useNavigate()

  const [BGColor, setBGColor] = useState("")

  useEffect(()=>{
setBGColor(theme?.paper)
  }, [theme])

  function compareStrings(str1, str2) {
    // Helper function to remove "/U2Fsd" if it exists in the string
    function removeU2Fsd(str) {
      const index = str.indexOf("/U2Fsd");
      return index !== -1 ? str.slice(0, index) : str;
    }
  
    // Remove "/U2Fsd" from both strings
    const cleanedStr1 = removeU2Fsd(str1);
    const cleanedStr2 = removeU2Fsd(str2);
  
    // Return true if the cleaned strings are the same
    return cleanedStr1 === cleanedStr2;
  }
  
  
  return (
    <motion.div

        onMouseOver={(e)=>{e.preventDefault();setBGColor(theme?.pale)}}
        onMouseLeave={(e)=>{e.preventDefault();setBGColor(theme?.paper)}}
        onClick={option?.action ? option?.action : (e)=>{e.preventDefault();navigate(option?.link)}}
        // whileHover={{backgroundColor: theme?.pale}}
        // whileTap={{backgroundColor: theme?.paper}}
        // 
        style={{display: "flex", cursor: "pointer", minWidth: "max-content", backgroundColor: BGColor, alignItems: "center", padding: 12, borderRadius:3}}>
      <div style={{color: compareStrings(pathname, option?.link) ? theme?.name == "light" ? theme?.primary : "rgb(247,151,38)" : theme?.text}}>
      {option?.icon}
      </div>
      <Text color={compareStrings(pathname, option?.link) ? "primary" : "text"}>{option?.label}</Text>
     </motion.div>
  )
}

export default navbar_link

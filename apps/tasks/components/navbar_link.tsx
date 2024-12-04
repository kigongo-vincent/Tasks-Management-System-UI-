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

  return (
    <motion.div

        onHoverStart={()=>setBGColor(theme?.pale)}
        onHoverEnd={()=>setBGColor(theme?.paper)}
        onClick={option?.action ? option?.action : ()=>navigate(option?.link)}
        // whileHover={{backgroundColor: theme?.pale}}
        // whileTap={{backgroundColor: theme?.paper}}
        // 
        style={{display: "flex", cursor: "pointer", minWidth: "max-content", backgroundColor: BGColor, alignItems: "center", padding: 12, borderRadius:3}}>
      <div style={{color: pathname == option?.link ? theme?.name == "light" ? theme?.primary : "rgb(247,151,38)" : theme?.text}}>
      {option?.icon}
      </div>
      <Text color={pathname == option?.link ? "primary" : "text"}>{option?.label}</Text>
     </motion.div>
  )
}

export default navbar_link

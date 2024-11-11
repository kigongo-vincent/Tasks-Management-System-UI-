
//@ts-nocheck
import React from 'react'
import {useSelector} from "react-redux"
import { getTheme } from '../model/data'
import { Theme } from '../types'
import LoginImage from "../assets/images/login.svg"

const background = ({children}) => {

    const theme: Theme = useSelector(getTheme)

  return (
    <div 
    className='login-bg'
    style={{
        backgroundColor: theme?.pale,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundPosition: "left",
        backgroundSize: "contain",
        backgroundRepeat:"no-repeat",
        width: "100vw",
        
    }}
    >
      {children}
    </div>
  )
}

export default background

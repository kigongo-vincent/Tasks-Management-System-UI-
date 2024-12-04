import React from 'react'
import { useSelector } from 'react-redux'
import { getTheme } from '../model/data'
import Spinner from "../assets/icons/tube-spinner.svg"
import { Theme } from '../types'

const button = ({loading, title, onClick, fullwidth, contain, outline}) => {

  const theme:Theme = useSelector(getTheme)

  return (
    <button 

    onClick={onClick}
    style={{
      background: !outline ? theme?.primary: theme?.pale,
      color: !outline ? "aliceblue" : theme?.name == "light" ? theme?.primary : theme?.text,
      // border: !outline ? "none" : "1px solid " + theme?.name == "light" ? theme?.primary : theme?.text,
      // border: !outline ? "none" : "1px solid " + theme?.name == "light" ? theme?.primary : theme?.text,
      border: !outline ? "none" : theme?.name == "light" ? "1px solid " + theme?.primary : "1px solid rgba(100,100,100, .4)", 
      outline: "none",
      width: fullwidth ? "98%" : contain ? "max-content" : "81%",
      boxShadow: !outline ? "10px 10px 20px rgba(0,0,0,.1)" : "",
      padding: 15,
      borderRadius: 5
    }}>
      {loading ? <img src={Spinner} height={18}/>: title}
    </button>
  )
}

export default button

import React from 'react'
import { useSelector } from 'react-redux'
import { getTheme } from '../model/data'
import Spinner from "../assets/icons/tube-spinner.svg"

const button = ({loading, title, onClick, fullwidth, contain, outline}) => {

  const theme = useSelector(getTheme)

  return (
    <button 

    onClick={onClick}
    style={{
      background: !outline ? theme?.primary: theme?.paper,
      color: !outline ? "aliceblue" : theme?.name == "light" ? theme?.primary : theme?.text,
      border: !outline ? "none" : "1px solid " + theme?.name == "light" ? theme?.primary : theme?.text,
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

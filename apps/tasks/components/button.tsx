import React from 'react'
import { useSelector } from 'react-redux'
import { getTheme } from '../model/data'
import Spinner from "../assets/icons/tube-spinner.svg"

const button = ({loading, title, onClick, fullwidth, contain}) => {

  const theme = useSelector(getTheme)

  return (
    <button 

    onClick={onClick}
    style={{
      background: theme?.primary,
      color: "aliceblue",
      border: "none",
      outline: "none",
      width: fullwidth ? "98%" : contain ? "max-content" : "81%",
      boxShadow: "10px 10px 20px rgba(0,0,0,.1)",
      padding: 17,
      borderRadius: 5
    }}>
      {loading ? <img src={Spinner} height={18}/>: title}
    </button>
  )
}

export default button

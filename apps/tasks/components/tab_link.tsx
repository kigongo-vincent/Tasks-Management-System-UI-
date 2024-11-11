import React from 'react'
import Text from "./text"
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTheme, setAlert, setUser } from '../model/data'
import Button from "./button"
import { Theme } from '../types'

export interface Props{
icon : any,
label: string,
link: string
}

const tab_link = (props: Props) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme:Theme = useSelector(getTheme)

  const {pathname} = useLocation()

  const logout=()=>{
    dispatch(setUser({email: ""}))
    navigate("/")
    dispatch(setAlert(null))
    setTimeout(() => {
      dispatch(setAlert({title: "Session terminated", body: "You have been logged out", mode: "normal"}))
    }, 500);
  }

  const action =()=>{
    if(props?.label?.toLowerCase() == "logout"){
      dispatch(setAlert({title: "Logout Confirmation", mode: "normal", body: "Are you sure you want to logout", buttons: [<Button onClick={logout} contain title={"confirm Logout"}/>]}))

    }else{
      navigate(props?.link)
    }
  }

  return (
    <div 
    onClick={action}
    style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: pathname?.includes(props?.link) ? theme?.primary: theme?.text
    }}>
      {props?.icon}
      {/* <br />
      <Text small>{props?.label}</Text> */}
    </div>
  )
}

export default tab_link

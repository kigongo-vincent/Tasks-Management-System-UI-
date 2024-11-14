import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTheme, getUser, setAlert, setUser } from '../model/data'
import Logo from "../assets/icons/logo.svg";
import { FaBackspace, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Text from "./text"
import { Theme, User } from '../types';
import { useNavigate } from 'react-router-dom';
import Button from "./button"


const navbar = () => {

  const theme: Theme = useSelector(getTheme)
  const user:User = useSelector(getUser)
  const dispatch = useDispatch()
  const navigate= useNavigate()

  const logout=()=>{
    dispatch(setUser({email: ""}))
    navigate("/")
    dispatch(setAlert(null))
    setTimeout(() => {
      dispatch(setAlert({title: "Session terminated", body: "You have been logged out", mode: "normal"}))
    }, 500);
  }

  const BackButton=()=>{
    return(
      <div
      className='d-none'
      onClick={()=>navigate(-1)}
      style={{
        // position: "fixed",
        // background: theme?.pale,
        // bottom: "2.5%",
        // right: "2.5%",
        marginLeft: 10,
        alignItems: "center",
        // boxShadow: "10px 10px 20px rgba(0,0,0,.01)",
        // padding: "15px 30px",
        borderRadius: 5,
        cursor: "pointer"
      }}>
        <FaBackspace color={theme?.text} style={{marginRight: 10}}/>
        <Text>Back</Text>
      </div>
    )
  }

  return (
    <div
      className='navbar'
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme?.paper,
          boxShadow: "10px 10px 20px rgba(50,50,50,.05)",
          borderRadius: 5,
          padding: "10px 20px",
        }}
      >
        {/* logo  */}
        <div style={{display: "flex", alignItems: "center"}}>
        <img src={Logo} height={50} alt="" />
        <BackButton/>
        </div>

        {/* email  */}
        <div className='d-none' style={{ alignItems: "center" }}>
          <Text>{user?.email ? user?.email : "Guest"}</Text>

          {/* user icon  */}
          <div
            style={{
              width: 40,
              height: 40,
              position: "relative",
              margin: "0 20px",
              background: theme?.pale,
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUser color={theme?.placeholder} />

            {/* activity badge  */}
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: "100%",
                background: theme?.success,
                position: "absolute",
                right: "5%",
                bottom: "5%",
              }}
            />
          </div>


          {/* logout icon  */}
          <FaSignOutAlt size={18} className='d-none' 
          onClick={()=>dispatch(setAlert({title: "Logout Confirmation", mode: "normal", body: "Are you sure you want to logout", buttons: [<Button onClick={logout} contain title={"confirm Logout"}/>]}))} style={{cursor: "pointer"}} 
          color={theme?.placeholder}/>
        </div>

        
      </div>
  )
}

export default navbar

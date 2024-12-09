import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { Theme } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setAlert, setTheme, setUser } from "../../model/data";
import { FaLock, FaMoon, FaSignOutAlt } from "react-icons/fa";
import Switch from "../../components/switch"
import { DarkMode, LightMode } from "../../theme/theme";
import { FaSun } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button"

const settings = () => {
  const theme: Theme = useSelector(getTheme);

  const [inDarkMode, setInDarkMode] = useState(theme?.name == "dark")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{

    setInDarkMode(theme?.name == "dark")

  }, [theme])

  useEffect(()=>{

    if(inDarkMode){

      // setdarkmode values 
      dispatch(setTheme(DarkMode))
      
    }else{
      
      // setlightmode values 
      dispatch(setTheme(LightMode))

    }

    

  },[inDarkMode])

  const logout = () => {
    dispatch(setUser({ email: "" }))
    navigate("/")
    dispatch(setAlert(null))
    // setTimeout(() => {
    //   dispatch(setAlert({title: "Session terminated", body: "You have been logged out", mode: "normal"}))
    // }, 500);
  }


  return (
    <div>
      <Text is_h1 heading>
        Settings
      </Text>
      <br />
      {/* <hr style={{ opacity: 0.1 }} /> */}
      <br />
      {/* <br /> */}
      <Text>Theme settings (experimental)</Text>

      <div
        style={{
          background: theme?.paper,
          borderRadius: 4,
          padding: 20,
          margin: "10px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* mode icon  */}
          {
            theme?.name == "dark"
            ?
            <FaMoon color={theme?.text} style={{ marginRight: 10 }} />
            :
            <FaSun color={theme?.text} style={{ marginRight: 10 }} />
          }

          {/* mode label  */}
          <Text>
            {theme?.name == "dark" ? "Dark" : "Light"} mode currently enabled
          </Text>
        </div>

        {/* mode switch  */}
        <Switch is_active={inDarkMode} setActive={setInDarkMode}/>
      </div>

        <Text>Access control</Text>
        <div
        onClick={()=>navigate(`/change_password`)}
        style={{
          background: theme?.paper,
          borderRadius: 4,
          padding: 20,
          margin: "15px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* mode icon  */}
            <FaLock color={theme?.text} style={{ marginRight: 10 }} />

          {/* mode label  */}
          <Text>
            Change your password
          </Text>
        </div>
      </div>
        <div
        onClick={() => dispatch(setAlert({ title: "Logout Confirmation", mode: "normal", body: "Are you sure you want to logout", buttons: [<Button onClick={logout} contain title={"confirm Logout"} />] }))}
        style={{
          background: theme?.paper,
          borderRadius: 4,
          padding: 20,
          margin: "15px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* mode icon  */}
            <FaSignOutAlt color={theme?.text} style={{ marginRight: 10 }} />

          {/* mode label  */}
          <Text>
            Logout
          </Text>
        </div>
      </div>

    </div>
  );
};

export default settings;

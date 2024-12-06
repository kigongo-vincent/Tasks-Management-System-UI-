import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { Theme } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setTheme } from "../../model/data";
import { FaLock, FaMoon } from "react-icons/fa";
import Switch from "../../components/switch"
import { DarkMode, LightMode } from "../../theme/theme";
import { FaSun } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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



  return (
    <div>
      <Text is_h1 heading>
        Settings
      </Text>
      <br />

      <br />
      <br />
      <hr style={{ opacity: 0.1 }} />
      <br />
      {/* <br /> */}

      <Text>Theme settings (experimental)</Text>

      <div
        style={{
          background: theme?.paper,
          borderRadius: 4,
          padding: 20,
          margin: "15px 0",
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

        <Text>Security</Text>
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

    </div>
  );
};

export default settings;

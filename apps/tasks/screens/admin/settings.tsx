import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { Theme } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setTheme } from "../../model/data";
import { FaMoon } from "react-icons/fa";
import Switch from "../../components/switch"
import { DarkMode, LightMode } from "../../theme/theme";
import { FaSun } from "react-icons/fa6";

const settings = () => {
  const theme: Theme = useSelector(getTheme);

  const [inDarkMode, setInDarkMode] = useState(theme?.name == "dark")
  const dispatch = useDispatch()

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
      <Text>Control the user experience of the application</Text>

      <br />
      <br />
      <hr style={{ opacity: 0.1 }} />
      <br />
      {/* <br /> */}

      <Text>Theme settings</Text>

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
            {theme?.name == "dark" ? "Dark" : "Light"} mode currently enabled (click on the switch to deactivate)
          </Text>
        </div>

        {/* mode switch  */}
        <Switch is_active={inDarkMode} setActive={setInDarkMode}/>
      </div>
    </div>
  );
};

export default settings;

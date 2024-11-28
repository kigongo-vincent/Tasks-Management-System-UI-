import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useSelector } from "react-redux";
import { getTheme } from "../model/data";
import { useNavigate } from "react-router-dom";
import {FaBackspace} from "react-icons/fa"
import Text from "./text"
import BottomNavigation from "./tabs"

const layout = ({ children, center }) => {
  const theme = useSelector(getTheme);
  const navigate = useNavigate()

  const BackButton=()=>{
    return(
      <div 
      onClick={()=>navigate(-1)}
      style={{
        // position: "fixed",
        background: theme?.paper,
        // bottom: "2.5%",
        // right: "2.5%",
        display:"flex",
        alignItems: "center",
        boxShadow: "10px 10px 20px rgba(0,0,0,.01)",
        padding: "15px 30px",
        borderRadius: 5,
        cursor: "pointer"
      }}>
        <FaBackspace style={{marginRight: 10}}/>
        <Text>Back to previous page</Text>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: theme?.pale,
        height: "96vh",
        width: "95vw",
        padding: "2vh 2.5vw",
      }}
    >
      {/* navbar  */}
      <Navbar />

      {/* body  */}
      <div
        style={{
          display: "flex",
          marginTop: 10,
          height: "82vh",
          // background: "red",
          boxShadow: "10px 10px 20px rgba(0,0,0,.01)",
        }}
      >
        {/* sidebar  */}
        <Sidebar />



        <div
        className="content"
          style={{
            width: "100%",
            // border: "1px solid red",
            paddingLeft: 10,
            overflowY: "auto",
            display: center && "flex",
            alignItems: center && "center",
            justifyContent: center && "center",
            borderRadius: 3,
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* <div style={{width: "max-content", paddingBottom: 10}}>
  <BackButton/>
          </div> */}
          {children}

          {/* break line  */}
      <div className="br"/>
        </div>
      </div>

      

      {/* bottom navigation  */}
      <BottomNavigation/>

    </div>
  );
};

export default layout;

import React from "react";
import { useSelector } from "react-redux";
import { getTheme } from "../../model/data";
import { Theme } from "../../types";
import Text from "../../components/text";
import Card from "../../components/card";
import { FaHotel, FaUser } from "react-icons/fa";

const index = () => {
  const theme: Theme = useSelector(getTheme);

  const setTableColors=()=>{
    const allTrs = document.querySelectorAll("tr:nth-child(2n)")
    allTrs?.forEach(tr => {
      tr.classList.add("red")
    })
  }

  return (
    <div style={{ width: "100%" }}>
      {/* users card  */}
      <div
        style={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Card
          fullwidth
          icon={<FaUser color={theme?.placeholder} />}
          title={"50"}
          subtitle="users"
        />
        <div style={{margin: "0 10px"}}/>
        <Card
          fullwidth
          icon={<FaHotel color={theme?.placeholder} />}
          title={"5670"}
          subtitle="Companies"
        />
      </div>

      {/* companies  */}
    </div>
  );
};

export default index;

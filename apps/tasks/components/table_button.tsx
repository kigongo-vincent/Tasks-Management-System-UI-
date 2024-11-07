import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, setAlert } from "../model/data";
import { FaEye, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import Text from "./text";
import { useNavigate } from "react-router-dom";
import Button from "./button"
import Modal from "./modal"
import AddCompany from "./add_company";

export interface Props {
  mode: "edit" | "view" | "delete";
  row?: any,
  redirect_path?: string;
  showBody?: (data: any)=>void,
  setter?: any
}

const table_button = (props: Props) => {
  const theme = useSelector(getTheme);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const deleteRow = () => {
    dispatch(setAlert({
      title: "Delete Confirmation",
      body: "Are you sure you want to delete this item",
      buttons: [<Button contain onClick={()=>props?.setter(props?.row["id"])} title={"confirm delete"} loading={false}/>]
    }))
  };

  const editRow = () => {
    // alert(props?.row["id"]);
    setOpen(!open)

  };

  const viewRow = () => {
    if(!props?.redirect_path){
      props?.showBody && props.showBody(props.row)
      return
    }
    navigate(props?.redirect_path ? props?.redirect_path + "/" + props?.row["id"] : "", {state: {row: props?.row}});
  };

  return (
    <div
      onClick={
        props?.mode == "delete"
          ? deleteRow
          : props?.mode == "view"
          ? viewRow
          : editRow
      }
      style={{
        background: theme?.pale,
        padding: "10px 20px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        width: "max-content",
        cursor: "pointer",
      }}
    >
      {props?.mode == "view" ? (
        <FaEye color={theme?.text} size={15} />
      ) : props?.mode == "delete" ? (
        <FaTrashAlt onClick={deleteRow} color={theme?.text} size={15} />
      ) : (
        <FaPen color={theme?.text} size={15} />
      )}
      <div style={{ margin: "0 5px" }} />
      <Text>{props?.mode}</Text>
      
      {/* modal  */}
      {
        open
        &&
        <Modal open={open} content={<AddCompany values={props?.row}  setOpen={setOpen}/>} title="Edit company" setOpen={setOpen} />
      }

    </div>
  );
};

export default table_button;

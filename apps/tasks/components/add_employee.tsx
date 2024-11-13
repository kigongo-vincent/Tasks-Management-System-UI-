import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTheme, SERVER_URL, setAlert } from "../model/data";
import { Theme } from "../types";
import Input from "./input";
import Button from "./button";
import { verifyPassword } from "../utils/password_checker";


export interface Props {
  setOpen: (open: boolean) => void;
  add: (data: any)=>void,
  values: any
  updateEmp?: any
}

const add_department = (props: Props) => {
  const theme: Theme = useSelector(getTheme);
  const dispatch = useDispatch()

  const [name, setName] = useState({
    value: "",
    error: null,
  });
  const [email, setEmail] = useState({
    value: "",
    error: null,
  });
  const [password, setPassword] = useState({
    value: "",
    error: null,
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState({
    value: "",
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const server = useSelector(SERVER_URL);
  const { id } = useParams();

  const onSubmit = async (e) => {

    e.preventDefault()

    if(props?.values){

      if(props?.values["email"] == email?.value && !password?.value){
        dispatch(setAlert({title: "No changes detected", body: "Notthing to change"}))
        return
      }

      if(password?.value?.length != 0){

        if (!verifyPassword(password.value)) {
          dispatch(
            setAlert({
              title: "Weak password",
              body: "password must contain 1 number, a lowecase, uppercase and special character",
              mode: "error",
            })
          );
          return;
        }
  
        if(password?.value != passwordConfirmation?.value){
          dispatch(setAlert({title: "Unmatching password", body: "Please provide matching passwords", mode: "error"}))
          return
        }
      }
      setLoading(true)
      const res = await fetch(`${server}/update_user/${props?.values["id"]}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: password?.value?.length != 0 ? JSON.stringify({
          email: email?.value,
          password: password?.value
        }) :JSON.stringify({
          email: email?.value
        })
      })

      if(res.status == 200){
        dispatch(setAlert({title: "employee updated", body: "employee has been updated successfully", mode: "success"}))
        setLoading(false)
        setPassword({value: "", error:null})
        setPasswordConfirmation({value: "", error: null})
        props?.updateEmp(await res.json())
        
      }else{
        dispatch(setAlert({title: "employee failed to be updated", body: "employee has not been updated, please try again", mode: "error"}))
        setLoading(false)
      }
      

    }else{
      if(!email.value || !password?.value){
        dispatch(setAlert({title: "Empty form fields", body: "Ensure you fillout all form fields befor submitting", mode: "error"}))
        return
      }

      if (!verifyPassword(password.value)) {
        dispatch(
          setAlert({
            title: "Weak password",
            body: "password must contain 1 number, a lowecase, uppercase and special character",
            mode: "error",
          })
        );
        return;
      }

      if(password?.value != passwordConfirmation?.value){
        dispatch(setAlert({title: "Unmatching password", body: "Please provide matching passwords", mode: "error"}))
        return
      }

    setLoading(true);
    const res = await fetch(`${server}/employees/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email?.value,
        password: password?.value,
      }),
    });

    if (res.status == 201) {
      const data = await res.json();
      dispatch(setAlert({title: "Employee uploaded successfully", body: "Employee has been created Successfully", mode: "success"}))
      setLoading(false);
      props?.setOpen(false);
      props?.add(data)
    } else {
      dispatch(setAlert({title: "Failed to upload employee", body: "Please try again with a different email", mode: "error"}))
      setLoading(false);
    }
    }
      
  };

  useEffect(()=>{

    if(props?.values){
      setEmail({...email, value: props?.values["email"]})
    }

  },[props?.values])

  return (
    <form onSubmit={onSubmit}>
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"Employee's email"}
        type={"email"}
        setter={setEmail}
        input={email}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"password"}
        type={"password"}
        setter={setPassword}
        input={password}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"password confirmation"}
        type={"password"}
        setter={setPasswordConfirmation}
        input={passwordConfirmation}
      />
      <br />
      <Button
        loading={loading}
        fullwidth
        onClick={onSubmit}
        title={props?.values ?"Edit employee": "Add an employee"}
      />
    </form>
  );
};

export default add_department;

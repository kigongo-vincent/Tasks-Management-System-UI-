import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { addTodo, editTodo, getTheme, getUser, SERVER_URL, setAlert, setLoadingState } from "../model/data";
import { Theme, User } from "../types";
import Input from "./input";
import Text from "./text";
import Button from "./button";
import { GET, POST } from "../utils/HTTP";
import Switch from "./switch";

export interface Props {
  setOpen: (open: boolean) => void;
  setData: (data: any) => void;
  data: any[];
  updateTasks: any
  values: any
}

const add_task = (props: Props) => {
  const theme: Theme = useSelector(getTheme);
  const dispatch = useDispatch();
  const [addProject, setAddProject] = useState(false);
  const user:User = useSelector(getUser)

  const [title, setTitle] = useState({
    value: "",
    error: null,
  });

  const [body, setBody] = useState({
    value: "",
    error: null,
  });
  const [duration, setDuration] = useState({
    value: "",
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const server = useSelector(SERVER_URL);
  const { id } = useParams();

  const errorMessage = () => {
    dispatch(
      setAlert({
        title: "Failed to add task",
        body: "Something went wrong, please try again",
        mode: "error",
      })
    );
  };

  const successMessage = () => {
    dispatch(
      setAlert({
        title: "Task uploaded successfully",
        body: "New task has been added",
        mode: "success",
      })
    );
  };
  

  const onSubmit = async(e) => {
    e.preventDefault();

    if(!props?.values){

      if(!title?.value){
        dispatch(setAlert({
          title: "Empty fields",
          body: "please fillout all form fields",
          mode: "error"
        }))
        return
      }

      dispatch(addTodo({title: title?.value}))
      props?.setOpen(false)
      dispatch(setAlert({title: "Todo saved", body: "The activity has been saved on your machine", mode: "success"}))
      
    }else{
      if(props?.values["title"] == title?.value){
        dispatch(setAlert({title: "No changes detected", body: "There is nothing to update", mode: "normal"}))
        return
      }else{

        if(!title?.value){
          dispatch(setAlert({title: "empty fields detected", body: "Please fill out all form fields", mode: "error"}))
          return
        }
        
        dispatch(editTodo({id: props?.values["id"], title: title?.value}))
        props?.setOpen(false)
        dispatch(setAlert({title: "Todo updated", body: "The activity has been updated successfully", mode: "success"}))

      }
    }
  };

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);

  // useEffect(()=>{
  //     dispatch(setLoadingState(loading))
  // },[loading])

  useEffect(() => {
    if (addProject) {
      setProject(projects[0]?.id);
    }
  }, [addProject]);


  useEffect(()=>{

    if(props?.values){
      setBody({...body, value: props?.values["body"]})
      setDuration({...duration, value: props?.values["duration"]})
      setTitle({...title, value: props?.values["title"]})

    }

  },[props?.values])

  const {state} = useLocation()

  // useEffect(()=>{
  //  if(state?.row){

  //   GET({ path: "/projects/" + state?.row?.company, setData: setProjects, setLoading: setLoading });

  //  }else{

  //   user?.company && GET({ path: "/projects/" + user?.company, setData: setProjects, setLoading: setLoading });

  //  }
  // }, [state, user])

  return (
    <form onSubmit={onSubmit}>
      <br />
      <Input
        // large
        noBorder
        fullwidth
        placeholder={"Title"}
        type={"text"}
        setter={setTitle}
        input={title}
      />
      
      <div style={{margin: "0 2px"}}/>
      <Button
        loading={loading}
        fullwidth
        onClick={onSubmit}
        title={props?.values ? "Edit activity": "Add activity"}
      />
    </form>
  );
};

export default add_task;

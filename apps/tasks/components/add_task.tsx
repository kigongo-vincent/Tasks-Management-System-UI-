import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getTheme, getUser, SERVER_URL, setAlert, setLoadingState } from "../model/data";
import { Theme, User } from "../types";
import Input from "./input";
import Text from "./text";
import Button from "./button";
import { GET, POST } from "../utils/HTTP";
import Switch from "./switch";
import { decryptData, encryptData } from "../utils/security";

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
    value: 0,
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const server = useSelector(SERVER_URL);
  let { id } = useParams();
  id = decryptData(id)

  
  

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

      if(title?.value?.length > 100){
        dispatch(setAlert({title: "Long title detected", body: "Please provide a reasonable title", mode: "error"}))
        return
      }

      if(duration?.value < 1){
        dispatch(setAlert({title: "Invalid duration", body: "Please provide the correct duration", mode: "error"}))
        return
      }

      if(!body?.value || !title?.value || !duration?.value){
        dispatch(setAlert({
          title: "Empty fields",
          body: "please fillout all form fields",
          mode: "error"
        }))
        return
      }

      POST({
        data: props?.data,
        path: "/tasks/" + id,
        payload: {
          body: body.value,
          duration: duration?.value,
          project: project && project,
          title: title?.value
        },
        setData: props?.setData,
        setLoading: setLoading,
        setOpen: props?.setOpen,
        errorMessage: errorMessage,
        successMessage: successMessage,
      });
    }else{
      if(props?.values["body"] == body?.value && props?.values["duration"] == duration?.value && props?.values["title"] == title?.value){
        dispatch(setAlert({title: "No changes detected", body: "There is nothing to update", mode: "normal"}))
        return
      }else{
        if(title?.value?.length > 100){
          dispatch(setAlert({title: "Long title detected", body: "Please provide a reasonable title", mode: "error"}))
          return
        }
        if(!body?.value || !duration?.value || !title?.value){
          dispatch(setAlert({title: "empty fields detected", body: "Please fill out all form fields", mode: "error"}))
          return
        }
        
        setLoading(true)
        const res = await fetch(`${server}/task/${props?.values["id"]}`,{
          method: "PATCH",
          headers: {
            "Content-type": 'application/json'
          },
          body: JSON.stringify({
            body: body?.value,
            duration: duration?.value,
            title: title?.value
          })
        })

        if(res.status == 202){
          const data = await res.json()
          props?.updateTasks(data)
          setLoading(false)
          props?.setOpen(false)
          dispatch(setAlert({title: "Task updated successfully", body: "The task has been updated", mode: "success"}))

        }else{
          setLoading(false)
          dispatch(setAlert({title: "Failed to update task", body: "Please try again", mode: "error"}))
        }
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

  useEffect(()=>{
   if(state?.row){

    GET({ path: "/projects/" + state?.row?.company, setData: setProjects, setLoading: setLoading });
    console.log(state?.row)

   }else{

    user?.company && GET({ path: "/projects/" + user?.company, setData: setProjects, setLoading: setLoading });

   }
  }, [state, user])

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
      <Input
        large
        noBorder
        fullwidth
        placeholder={"Description"}
        type={"text"}
        setter={setBody}
        input={body}
      />
      {/* <br /> */}
      <Input
        noBorder
        fullwidth
        placeholder={"duration (in minutes)"}
        type={"number"}
        setter={setDuration}
        input={duration}
      />
      <br />
      {/* time hint  */}
      <Text color="placeholder">{"Duration in hours: " + (duration?.value && Math.floor(duration?.value / 60) +
              ` hour${Math.floor(duration?.value / 60) == 1 ? "" : "s"} and ` +
              (duration?.value % 60) +
              " minutes")}</Text>
      <br />


      {
        !props?.values && <>
        <br />
      {
        projects.length > 0 && <div
        onClick={()=>setAddProject(!addProject)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "97%",
          cursor: "pointer"
        }}
      >
        <Text>Attach Project (optional)</Text>
        <div style={{margin: "0 5px"}}/>
        <Switch is_active={addProject} setActive={setAddProject} />
      </div>
      }
      <br /> <br />
        </>
      }
      {addProject && (
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          style={{
            backgroundColor: theme?.pale,
            color: theme?.text,
            width: "97%",
            marginBottom: 10,
            padding: 15,
            borderRadius: 2,
            colorScheme: theme?.name == "light" ? "light" : "dark",
            outline: "none",
            border: "none",
          }}
        >
          {projects?.map((project) => (
            <option  value={project?.id}>{project?.name}</option>
          ))}
        </select>
      )}
      
     
      <Button
        loading={loading}
        fullwidth
        onClick={onSubmit}
        title={props?.values ? "Edit task": "Add task"}
      />
      
    </form>
  );
};

export default add_task;

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
import {motion} from "framer-motion"

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
  const [isActive, setIsActive] = useState(false);
  const [positionX, setPositionX] = useState(0);

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

      if(!body?.value || !title?.value || !duration?.value){
        dispatch(setAlert({
          title: "Empty fields",
          body: "please fillout all form fields",
          mode: "error"
        }))
        return
      }

      if(duration?.value < 1){
        dispatch(setAlert({title: "Invalid Duration", body: "Please provide the correct duration", mode: "error"}))
        return
      }

      POST({
        data: props?.data,
        path: "/drafts/" + id,
        payload: {
          body: body.value,
          duration: Math.floor(duration?.value),
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
      if(props?.values["body"] == body?.value && props?.values["duration"] == duration?.value && props?.values["title"] == title?.value && props?.values["project"] == project){
        dispatch(setAlert({title: "No changes detected", body: "There is nothing to update", mode: "normal"}))
        return
      }else{

        if(!body?.value || !duration?.value || !title?.value){
          dispatch(setAlert({title: "empty fields detected", body: "Please fill out all form fields", mode: "error"}))
          return
        }

        if(duration?.value < 1){
          dispatch(setAlert({title: "Invalid Duration", body: "Please provide the correct duration", mode: "error"}))
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
            duration: Math.floor(duration?.value),
            title: title?.value,
            project: project
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
      if(props?.values){
        props?.values["project"] && setProject(props?.values["project"]);
        setIsActive(true)
      }else{
        setProject(projects[0]?.id);
      }
    }
  }, [addProject]);


  useEffect(()=>{

    if(props?.values){
      setBody({...body, value: props?.values["body"]})
      setDuration({...duration, value: props?.values["duration"]})
      setTitle({...title, value: props?.values["title"]})
      props?.values["project"] && setAddProject(true)
      console.log(props?.values["project"])
      setIsActive(props['values']['project'])
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

  useEffect(() => {
    if (isActive) {
      setPositionX(20);
      setAddProject(true)
    } else {
      setPositionX(0);
      setAddProject(false)
    }
  }, [isActive]);

  useEffect(() => {
    if (addProject) {
      if(props?.values){
        props?.values["project"] ? setProject(props?.values["project"]): setProject(projects[0]?.id)
        setIsActive(true)
      }else{
        setProject(projects[0]?.id);
      }
    }
  }, [addProject]);

  useEffect(()=>{
    if(!isActive){
      setProject(null)
    }
  },[isActive])

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
        limit={50}
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
        <>
        <br />
      {
        projects.length > 0 && <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "97%",
        }}
      >
        <Text>Attach Project (optional)</Text>
        <div style={{margin: "0 20px"}}/>
        
        {/* switch */}
        <div
      onClick={() => {
        setIsActive(!isActive);
      }}
      style={{
        width: 40,
        height: 20,
        cursor: "pointer",
        border:theme?.name == "dark" ? "1px solid grey":"none",
        background:
          theme?.name == "dark"
            ? !isActive
              ? "rgba(0,0,0,.1)"
              : theme?.primary
            : !isActive
            ? "rgba(0,0,0,.1)"
            : "rgba(255,110, 0, .2)",
        borderRadius: "100px",
      }}
    >
      {/* thumb  */}
      <motion.div
        animate={{ x: positionX }}
        style={{
          width: 20,
          height: 20,
          x: positionX,
          // border: "1px solid grey",
          background: theme?.name == "dark"? isActive ? theme?.text : "rgb(50,50,50)" : isActive ? theme?.primary : theme?.placeholder,
          // background: isActive ? theme?.text : theme?.primary,
          borderRadius: "100%",
          // borderRadius: "100%",
        }}
      />
    </div>
        {/* end switch */}

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
        title={props?.values ? "Save changes": "Add task"}
      />
      
    </form>
  );
};

export default add_task;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { addTask, editTask, getTheme, getUser, SERVER_URL, setAlert, setLoadingState } from "../model/data";
import { Task, Theme, User } from "../types";
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

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);

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

  useEffect(()=>{
    if(!addProject){
      setProject(null)
    }
  },[addProject])

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
      dispatch(addTask({
        id: Math.floor(Math.random() * 1000),
        title: title?.value,
        body: body?.value,
        local_timestamp: new Date().toISOString(),
        duration: duration?.value,
        employee: user?.user_id,
        project: project && project,
        project_name: project && projects?.find(p => parseInt(p?.id) == parseInt(project))?.name
      }))
      props?.setOpen(false)
        dispatch(setAlert({title: "Task saved", body: "The task has been saved on your machine", mode: "success"}))
    }else{
      if(props?.values["body"] == body?.value && props?.values["duration"] == duration?.value && props?.values["title"] == title?.value && props?.values["project"] == project){
        dispatch(setAlert({title: "No changes detected", body: "There is nothing to update", mode: "normal"}))
        return
      }else{

        if(!body?.value || !duration?.value || !title?.value){
          dispatch(setAlert({title: "empty fields detected", body: "Please fill out all form fields", mode: "error"}))
          return
        }

        const updated_task = {
          id: props?.values["id"],
          title: title?.value,
          body: body?.value,
          local_timestamp: new Date().toISOString(),
          duration: duration?.value,
          employee: user?.user_id,
          project: project && project,
          project_name: project && projects?.find(p => parseInt(p?.id) == parseInt(project))?.name
        }

        dispatch(editTask(updated_task))
        // console.log(updated_task)
        // props?.setData([...props?.data, updated_task])
        props?.setOpen(false)
        dispatch(setAlert({title: "Task updated successfully", body: "The task has been updated", mode: "success"}))
      }
    }
  };

 

  // useEffect(()=>{
  //     dispatch(setLoadingState(loading))
  // },[loading])

  useEffect(() => {
    if (addProject) {
      if(props?.values){
        props?.values["project"] && setProject(props?.values["project"]);
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
    }

  },[props?.values])

  const {state} = useLocation()

  useEffect(()=>{
   if(state?.row){

    GET({ path: "/projects/" + state?.row?.company, setData: setProjects, setLoading: setLoading });

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
      <Text color="placeholder">Duration in hours: {duration?.value && Math.floor(duration?.value / 60) +
              ` hour${Math.floor(duration?.value / 60) == 1 ? "" : "s"} and ` +
              (duration?.value % 60) +
              " minutes"}</Text>
      <br />
      <br />
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
        <Switch setActive={setAddProject} is_active={addProject}/>
      </div>
      }
      <br /> <br />
        </>
      
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
        title={props?.values ? "save changes": "Save to drafts"}
      />
    </form>
  );
};

export default add_task;

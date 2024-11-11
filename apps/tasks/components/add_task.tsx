import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTheme, SERVER_URL, setAlert, setLoadingState } from "../model/data";
import { Theme } from "../types";
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
      POST({
        data: props?.data,
        path: "/tasks/" + id,
        payload: {
          body: body.value,
          duration: duration?.value,
          project: project && project,
        },
        setData: props?.setData,
        setLoading: setLoading,
        setOpen: props?.setOpen,
        errorMessage: errorMessage,
        successMessage: successMessage,
      });
    }else{
      if(props?.values["body"] == body?.value && props?.values["duration"] == duration?.value){
        dispatch(setAlert({title: "No changes detected", body: "There is nothing to update", mode: "normal"}))
        return
      }else{

        if(!body?.value || !duration?.value){
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
            duration: duration?.value
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
    GET({ path: "/projects/1", setData: setProjects, setLoading: setLoading });
  }, []);

  useEffect(() => {
    if (addProject) {
      setProject(projects[0]?.id);
    }
  }, [addProject]);

  useEffect(() => {
    console.log(project);
  }, [project]);

  useEffect(() => {
    if(!addProject){
      
    }
  }, [addProject]);

  useEffect(()=>{

    if(props?.values){
      setBody({...body, value: props?.values["body"]})
      setDuration({...duration, value: props?.values["duration"]})
    }

  },[props?.values])

  return (
    <form onSubmit={onSubmit}>
      <Input
        large
        noBorder
        fullwidth
        placeholder={"Enter task"}
        type={"text"}
        setter={setBody}
        input={body}
      />
      {
        !props?.values && <>
        <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "97%",
        }}
      >
        <Text>Attach Project (optional)</Text>
        <Switch setActive={setAddProject} />
      </div>
      <br /> <br />
        </>
      }
      {addProject && (
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          style={{
            backgroundColor: theme?.pale,
            width: "97%",
            marginBottom: 10,
            padding: 15,
            borderRadius: 2,
            outline: "none",
            border: "none",
          }}
        >
          {projects?.map((project) => (
            <option value={project?.id}>{project?.name}</option>
          ))}
        </select>
      )}
      <Input
        noBorder
        fullwidth
        placeholder={"duration (in minutes)"}
        type={"number"}
        setter={setDuration}
        input={duration}
      />
      <br />
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

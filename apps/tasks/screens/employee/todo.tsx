
import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { FaCirclePlus, FaEye, FaPen } from "react-icons/fa6";
import {
  getTasks,
  getTheme,
  getTodos,
  getUser,
  removeTask,
  removeTodo,
  SERVER_URL,
  setAlert,
  setLoadingState,
} from "../../model/data";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "../../types";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Table from "../../components/table";
import Header from "../../components/header";
import Modal from "../../components/modal";
import { DELETE, GET } from "../../utils/HTTP";
import AddTodo from "../../components/add_todo";
import Input from "../../components/input";
import moment from "moment";
import Button from "../../components/button";
import { decryptData, encryptData } from "../../utils/security";

const tasks = () => {
  // company details
  // departments in the company
  // adding a new department

  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);

  // tasks
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  let { id } = useParams();
  id = decryptData(id)
  const dispatch = useDispatch();
  const [details, setDetails] = useState("");
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(false);
  const saved_tasks = useSelector(getTodos);

  useEffect(() => {
    // GET({ path: "/tasks/" + id, setData: setTasks, setLoading: setLoading });
    setTasks(saved_tasks);
  }, [saved_tasks]);

  useEffect(() => {
    dispatch(setLoadingState(loading));
  }, [loading]);

  const showBody = (row: any) => {
    setDetails(row);
  };

  const getTotalHours = () => {
    if (tasks?.length != 0) {
      let total = 0;
      tasks?.forEach((task) => {
        total += parseFloat(task["duration"]);
      });
      setHours(total);
    } else {
      setHours(0);
    }
  };

  const setter = (id) => {
    dispatch(setAlert({ title: "", body: "", mode: "normal" }));
    dispatch(removeTodo(id));
    // DELETE({ data: tasks, setData: setTasks, path: "/task/" + id, id: id });
    getTotalHours();
  };

  useEffect(() => {
    getTotalHours();
  }, [tasks]);

  const editTask = (row) => {
    setCurrentTask(row);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      setCurrentTask(null);
    }
  }, [open]);

  const updateTasks = (payload) => {
    setTasks(tasks?.map((task) => (task?.id == payload?.id ? payload : task)));
  };

  const user = useSelector(getUser);

  const publish=()=>{
    dispatch(setAlert({title: "publish Confirmation", mode: "normal", body: "Are you sure you want to publish these tasks", buttons: [<Button onClick={uploadTasks} loading={loading} contain title={"confirm publish"}/>]}))
  }

  const uploadTasks=async()=>{
    setLoading(true)
    dispatch(setAlert({title: "", mode: "normal", body: ""}))
    
    // show loader 
    // setLoading(true)

    // make API request to backend 


      // loop through tasks, obtaining the employee, title, body and project if not null, and duration 
      tasks.forEach(async(task)=> {
        dispatch(setLoadingState(true))
        const res = await fetch(`${server}/tasks/${user?.user_id}`,{
          method: "POST",
          headers: {
            "Content-type": 'application/json'
          },
          body: JSON.stringify({
            body: task?.body,
            duration: task?.duration,
            title: task?.title,
            project: task?.project && task?.project
          })
        })

        if(res.status == 201){
          dispatch(removeTask(task?.id))
          if(task?.id == tasks?.length){
            dispatch(setLoadingState(false))
            dispatch(setAlert({title: "Upload success", body: "You have successfully uploaded your pending tasks", mode: "success"}))
          }
        }
        else{
          dispatch(setAlert({title: "Upload Error", body: "please try again", mode: "error"}))
          dispatch(setLoadingState(false))
        }

      })

      // clear the tasks list 

      // hide loader
      setLoading(false) 
  }

  return !user?.email ? (
    <Navigate to={"/"} />
  ) : (
    <div>
      {/* header  */}
      <Header
        title="a todo"
        setOpen={setOpen}
        count={tasks?.length}
        heading={`Todos`}
      />

      {/* body  */}
      {
        tasks?.length == 0 ? (
          <Text is_h1>No results found</Text>
        ) : (
          <Table
            cache
            editor={editTask}
            setter={setter}
            showBody={showBody}
            columns={["title"]}
            rows={tasks}
            delete
            edit
            view
            // redirect_path="/department"
          />
        )
        // :

        // <Text is_h1>Please select a date</Text>
        //   dailyTasks?.length == 0
        //   ?
        //   :
        //   <Table
        //   setter={setter}
        //   showBody={showBody}
        //   columns={["body", "duration", "project_name"]}
        //   rows={dailyTasks}
        //   delete
        //   edit
        //   view
        //   // redirect_path="/department"
        // />
      }

      {details && (
        <Modal
          open={Boolean(details)}
          setOpen={setDetails}
          content={
            <div>
              <Text
                // color="primary"
                is_h1
                heading
                justify
              >
                {details["title"]}
              </Text>
              <br />
              <br />
              {/* <hr style={{opacity: .3}}/> */}
              {/* <br /> */}
              <Text justify>{details["body"]}</Text>
            </div>
          }
          title="Task details"
        />
      )}

      {open && (
        <Modal
          title={currentTask ? "Edit todo" : "add todo"}
          open={open}
          setOpen={setOpen}
          content={
            <AddTodo
              values={currentTask}
              setData={setTasks}
              updateTasks={updateTasks}
              data={tasks}
              setOpen={setOpen}
            />
          }
        />
      )}
    </div>
  );
};

export default tasks;

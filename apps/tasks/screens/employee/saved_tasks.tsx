
import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { FaCirclePlus, FaEye, FaPen } from "react-icons/fa6";
import {
  getTasks,
  getTheme,
  getUser,
  removeTask,
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
import AddTask from "../../components/add_local_task";
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

  const saved_tasks = useSelector(getTasks)

  let { id } = useParams();
  id = decryptData(id)
  const dispatch = useDispatch();
  const [details, setDetails] = useState("");
  const [hours, setHours] = useState(0);

  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const now = new Date();

  const [startDate, setStartDate] = useState({
    value: ``,
    error: null,
  });

  const [endDate, setEndDate] = useState({
    value: "",
    error: null,
  });

  const [search, setSearch] = useState({
    value: "",
    error: null,
  });

  useEffect(() => {
    setTimeout(() => {
      setStartDate({ ...startDate, value: moment()?.format("YYYY-MM-DD") });
      setEndDate({ ...startDate, value: moment()?.format("YYYY-MM-DD") });
    }, 1000);
  }, []);

  // const saved_tasks = useSelector(getTasks);

  useEffect(() => {
    // GET({ path: "/tasks/" + id, setData: setTasks, setLoading: setLoading });
    // setTasks(saved_tasks);
    GET({path: "/drafts/" + id, setData: setTasks, setLoading: setLoading})
  }, []);

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
    // dispatch(removeTask(id));
    DELETE({ data: tasks, setData: setTasks, path: "/task/" + id, id: id });
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

  const navigate = useNavigate()

  const uploadTasks=async()=>{
    setLoading(true)
    dispatch(setAlert({title: "", mode: "normal", body: ""}))
    
    // show loader 
    // setLoading(true)

    // make API request to backend 


      // loop through tasks, obtaining the employee, title, body and project if not null, and duration 
      saved_tasks?.length > 0 && saved_tasks.forEach(async(task)=> {
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

        }
        else{
          dispatch(setAlert({title: "Upload Error", body: "please try again", mode: "error"}))
          // dispatch(setLoadingState(false))
          setLoading(false)
          return
        }

      })

      const res = await fetch(`${server}/drafts/${id}`, {
        method: "PATCH"
      })

      if(res.status == 202){
        dispatch(setAlert({title: "Publish success", body: "Your tasks have been published", mode: "success"}))
        setLoading(false)
        navigate(`/employee/${encryptData(id)}`)
      }else{
        dispatch(setAlert({title: "Publish failed", body: "Please try again", mode: "error"}))
        setLoading(false)
      }

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
        title="a task to drafts"
        setOpen={setOpen}
        count={tasks?.length}
        heading={`Pending Task(s)`}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: innerWidth > 768 ? 0 : 10
        }}
      >
        {/* total number of working hours  */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "10px 0",
            background: innerWidth > 768 ? theme?.paper: "",
            boxShadow: innerWidth > 768 ? "10px 10px 20px rgba(0,0,0,.05)": "none",
            borderRadius: 5,
            width: "max-content",
            padding: innerWidth > 768 ? "18px 20px" : "0px",
          }}
        >
          {innerWidth > 768 ? (
            <Text>Total Number of working hours</Text>
          ) : (
            <Text>working hours:</Text>
          )}
          <div
            style={{
              // background: theme?.error,
              // height: 30,
              // width: innerWidth > 768 ? "": "100vw",
              padding: "3px 12px",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "space-between",
              borderRadius: "100px",
              // marginLeft:
            }}
          >
            <Text heading>
              {Math.floor(hours / 60) +
                ` h${innerWidth > 768 ? "our" : "r"}${Math.floor(hours / 60) == 1 ? "" : "s"} and ` +
                (hours % 60) +
                `m${innerWidth > 768 ? "inutes" : "s"}`}
            </Text>
          </div>
        </div>

        {/* publish button  */}
        {
          tasks?.length > 0 && <Button
          outline
          title={"Publish tasks"}
          onClick={publish}
          loading={loading}
          contain
        />
        }
      </div>

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
            columns={["title", "duration", "project_name"]}
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
          title={currentTask ? "Edit task" : "add task"}
          open={open}
          setOpen={setOpen}
          content={
            <AddTask
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

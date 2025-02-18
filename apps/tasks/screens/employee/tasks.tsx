import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { FaBook, FaBriefcase, FaBuilding, FaCalendar, FaChartArea, FaChartBar, FaCirclePlus, FaClock, FaEye, FaPen, FaUser } from "react-icons/fa6";
import {
  getTheme,
  getUser,
  SERVER_URL,
  setAlert,
  setLoadingState,
} from "../../model/data";
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "../../types";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "../../components/table";
import Header from "../../components/header";
import Modal from "../../components/modal";
import { DELETE, GET } from "../../utils/HTTP";
import AddTask from "../../components/add_task";
import Input from "../../components/input";
import moment from "moment";
import { decryptData } from "../../utils/security";
import { sortArray } from "../../utils/sort";

const tasks = () => {
  // company details
  // departments in the company
  // adding a new department
  let { id } = useParams();
  id = decryptData(id)
  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);

  // tasks
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [filter, setFilter] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // ==============================task helper functions =============================================

  const populateFilteredTasks = () => { };

  const populateSearchResults = () => { };

  const populateDailyTasks = () => {
    const results = [];
    tasks?.forEach((task) => {
      const task_date = moment(task?.created_at)?.calendar();

      if (
        task_date?.includes("Today") &&
        !results?.some((t) => t?.id == task?.id)
      ) {
        results.push(task);
      }
    });
    setDailyTasks(results);
  };

  // set today's tasks
  useEffect(() => {
    tasks?.length != 0 && populateDailyTasks();
  }, [tasks]);

  // ==============================end task helper functions =============================================


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
    }, 200);
  }, []);

  useEffect(() => {
    GET({ path: "/tasks/" + id, setData: setTasks, setLoading: setLoading });
  }, []);

  useEffect(() => {
    dispatch(setLoadingState(loading));
  }, [loading]);

  const showBody = (row: any) => {
    setDetails(row);
  };

  const getTotalHours = () => {
    if (filteredTasks?.length != 0) {
      let total = 0;
      filteredTasks?.forEach((task) => {
        total += parseFloat(task["duration"]);
      });
      setHours(total);
    } else {
      setHours(0);
    }
  };

  const setter = (id) => {
    dispatch(setAlert({ title: "", body: "", mode: "normal" }));
    DELETE({ data: tasks, setData: setTasks, path: "/task/" + id, id: id });
    getTotalHours();
  };

  const searchTasks = (query: string) => {
    // Ensure query is case-insensitive by converting it to lowercase
    const lowerCaseQuery = query.toLowerCase();
  
    // Use filter to search through tasks based on the specific fields (project_name, title, body)
    const results = filteredTasks?.filter((task) => 
      ["project_name", "title", "body"].some((key) => {
        const value = task[key];
        // Check if value is a string or number and convert to string for case-insensitive comparison
        if (value !== undefined && value !== null) {
          const valueStr = value.toString().toLowerCase();
          return valueStr.includes(lowerCaseQuery); // Case-insensitive search
        }
        return false;
      })
    );
  
    // Update search results based on the results
    setSearchResults(results?.length ? results : []);
  };
  

  const filterTasks = (startDate: string, endDate: string) => {
    const start = moment(startDate);
    const end = moment(endDate);

    const results = [];
    tasks.forEach((task) => {
      const _date = moment(task?.created_at);
      if (_date?.isSameOrAfter(start) && _date.isSameOrBefore(end)) {
        results.push(task);
      }
    });

    setFilteredTasks(results);
  };

  useEffect(() => {
    if (startDate.value && endDate.value) {
      filterTasks(startDate.value, endDate.value);
    } else {
    }
  }, [startDate, endDate, tasks]);

  useEffect(() => {
    if (search?.value != "") {
      searchTasks(search?.value);
    }
  }, [search]);

  useEffect(() => {
    getTotalHours();
  }, [filteredTasks]);

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

  const user = useSelector(getUser)

  const [currentFilter, setCurrentFilter] = useState("")

  const filterOptions = [
    {
      label: "Title",
      icon: <FaBook />,
      action: () => {setFilteredTasks(sortArray(filteredTasks, "title", "asc")); setCurrentFilter("Title") }
    },
    {
      label: "Duration",
      icon: <FaClock />,
      action: () => {setFilteredTasks(sortArray(filteredTasks, "duration", "desc")); setCurrentFilter("Duration") }

    },
    {
      label: "Project",
      icon: <FaBriefcase />,
      action: () => {setFilteredTasks(sortArray(filteredTasks, "project_name", "asc")); setCurrentFilter("Project") }

    },
  ]

  return (
    !user?.email
      ?
      <Navigate to={"/"} />
      :

      <div>
        {/* header  */}
        <Header
          title={["company_admin", "admin", "employee"]?.includes(user?.role) && "a task"}
          setOpen={setOpen}
          count={filteredTasks?.length}
          heading={state?.row ? `Tasks for ${state?.row?.first_name}` : 'Tasks'}
        />


        {/* sub header  */}
        <div
          className="flex-vertical"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
            backgroundColor: theme?.paper,
            borderRadius: 5,
            padding: 15,
          }}
        >
          {/* filter  */}
          <div
            className="shrink"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              // background: "red",
              width: innerWidth < 768 ? "85vw" : "max-content",
            }}
          >


            {/* start date  */}
            <Input
              noBorder
              zeroMargin
              setter={setStartDate}
              input={startDate}
              fullwidth={innerWidth < 768}
              type={"date"}
              placeholder={"Starting date"}
            />

            <div style={{ margin: "0px 3px" }} />

            <br className="separator" />
            {/* end date  */}
            <Input
              noBorder
              fullwidth={innerWidth < 768}
              zeroMargin
              setter={setEndDate}
              input={endDate}
              type={"date"}
              placeholder={"ending date"}
            />
          </div>
          {innerWidth < 768 && <br />}

          {/* search  */}
          <div className="search">
            <Input
              zeroMargin
              noBorder
              fullwidth={innerWidth < 768}
              setter={setSearch}
              input={search}
              type={"search"}
              placeholder={"search for tasks"}
            />
          </div>
        </div>

        {/* total number of working hours  */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "10px 0",
            background: theme?.paper,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
            borderRadius: 5,
            width: "max-content",
            padding: "18px 20px",
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
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "100px",
              // marginLeft:
            }}
          >
            <Text heading>
              {Math.floor(hours / 60) +
                ` hour${Math.floor(hours / 60) == 1 ? "" : "s"} and ` +
                (hours % 60) +
                " minutes"}
            </Text>
          </div>
        </div>

        {/* body  */}
        {
          // search?.value ||
          // startDate.value || endDate.value
          // ?
          search?.value ? (
            searchResults?.length == 0 ? (
              <Text is_h1>No Tasks found</Text>
            ) : (
              <Table
                currentFilter={currentFilter}
                filterOptions={filterOptions}
                setter={setter}
                showBody={showBody}
                editor={editTask}
                columns={["title", "duration", "project_name"]}
                rows={searchResults}
                delete={["company_admin", "admin"]?.includes(user?.role)}
                edit={["company_admin", "admin"]?.includes(user?.role)}
                view
              // redirect_path="/department"
              />
            )
          ) : filteredTasks?.length == 0 ? (
            <Text is_h1>No Tasks found</Text>
          ) : (
            <Table
              currentFilter={currentFilter}
              filterOptions={filterOptions}
              editor={editTask}
              setter={setter}
              showBody={showBody}
              columns={["title", "duration", "project_name"]}
              rows={filteredTasks}
              delete={["company_admin", "admin"]?.includes(user?.role)}
              edit={["company_admin", "admin"]?.includes(user?.role)}
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
                  justify>
                  {details["title"]}
                </Text>
                <br />
                <br />
                {/* <hr style={{opacity: .3}}/> */}
                {/* <br /> */}
                <Text justify children={details["body"]} />
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

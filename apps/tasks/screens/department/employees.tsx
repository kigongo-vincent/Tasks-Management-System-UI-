import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { FaCirclePlus, FaEye, FaPen } from "react-icons/fa6";
import {
  getTheme,
  getUser,
  SERVER_URL,
  setAlert,
  setLoadingState,
} from "../../model/data";
import { useDispatch, useSelector } from "react-redux";
import { Theme, User } from "../../types";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaLessThanEqual, FaTrashAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../components/input";
import Button from "../../components/button";
import { getRelativeTime } from "../../utils/getRelativeTime";
import Modal from "../../components/modal";
import AddEmployee from "../../components/add_employee";
import Table from "../../components/table";
import Header from "../../components/header";
import { DELETE, GET } from "../../utils/HTTP";

const employees = () => {
  // company details
  // departments in the company
  // adding a new department

  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { state } = useLocation();

  const addEmployee = (new_employee: any) => {
    setEmployees([...employees, new_employee]);
  };

  useEffect(() => {
    GET({
      path: `/employees/${id}`,
      setData: setEmployees,
      setLoading: setLoading,
    });
  }, []);

  useEffect(() => {
    dispatch(setLoadingState(loading));
  }, [loading]);

  const setActive = (active: boolean) => {
    alert("done");
  };

  const [currentEmployee, setCurrentEmployee] = useState({});

  const setter = (id) => {
    dispatch(setAlert({ title: "", body: "", mode: "normal" }));
    DELETE({
      data: employees,
      setData: setEmployees,
      path: "/employee/" + id,
      id: id,
    });
  };

  const editEmployee = (row: any) => {
    setOpen(true);
    setCurrentEmployee(row);
  };

  const updateEmployee = (payload) => {
    setEmployees(
      employees?.map((employee) =>
        employee?.id == payload.id ? payload : employee
      )
    );
    setOpen(false);
  };

  useEffect(()=>{

    if(!open){
      setCurrentEmployee(null)
    }

  },[open])

  const toggleAccountState=(id, new_state)=>{

    fetch(`${server}/update_user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({is_active: new_state})
    })
  }

  const user = useSelector(getUser)

  return (
    !user?.email 
    ?
    <Navigate to={"/"}/>
    :
    JSON.parse(localStorage.getItem("TMS_USER"))?.role == "department_admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "company_admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "admin" ?
    <div>
      {/* header  */}
      <Header
        setOpen={setOpen}
        title="consultant"
        count={employees?.length}
        heading="Consultant"
      />

      {/* body  */}
      {employees?.length == 0 ? (
        <Text is_h1>No results found</Text>
      ) : (
        <Table
          editor={editEmployee}
          setter={setter}
          setActive={setActive}
          columns={["email", "contact" ,"date_joined"]}
          rows={employees}
          delete
          toggle={toggleAccountState}
          edit
          view
          redirect_path="/employee"
        />
      )}

      {open && (
        <Modal
          title={currentEmployee ? "Edit Consultant" : "Add Consultant"}
          content={
            <AddEmployee
              values={currentEmployee}
              updateEmp={updateEmployee}
              add={addEmployee}
              setOpen={setOpen}
            />
          }
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
    :
    (
      <Navigate to={"/"}/>
    )
  );
};

export default employees;

import React, { useEffect, useMemo, useState } from "react";
import Text from "../../components/text";
import { FaCirclePlus, FaEnvelope, FaEye, FaPen, FaPhone } from "react-icons/fa6";
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
import { getRelativeTime } from "../../utils/getRelativeTime";
import Modal from "../../components/modal";
import AddMember from "../../components/add_member";
import Table from "../../components/table";
import Header from "../../components/header";
import { DELETE, GET } from "../../utils/HTTP";
import { decryptData, encryptData } from "../../utils/security";
import Button from "../../components/button"

const employees = () => {
  // company details
  // departments in the company
  // adding a new department

  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null)

  const [moveOpen, setMoveOpen] = useState(false)
  const [clipboard, setClipboard] = useState(null)
  const [department, setDepartment] = useState(null)


  const [departments, setDepartments] = useState([])

  const navigate = useNavigate()
  let { id } = useParams();
  id = decryptData(id)
  const dispatch = useDispatch();
  const { state } = useLocation();

  const addEmployee = (new_employee: any) => {
    setEmployees([...employees, new_employee]);
  };

  useMemo(() => {

    if (clipboard) {
      GET({ path: "/departments/" + clipboard["company"], setData: setDepartments, setLoading: setLoading })
    }

  }, [clipboard])

  const showBody = (payload: any) => {
    // console.log(payload)
    if (user?.role == "company_admin" || user?.role == "department_admin") {
      setDetails(payload)
    } else {
      navigate("/employee/" + encryptData(payload["id"], { state: { row: payload } }))
    }
  }

  useEffect(() => {

    if (!open) {
      setDetails(null)
    }

  }, [open])

  useEffect(() => {
    GET({
      path: `/members/${id}`,
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

  useEffect(() => {

    if (!open) {
      setCurrentEmployee(null)
    }

  }, [open])

  const toggleAccountState = (id, new_state) => {

    fetch(`${server}/update_user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ is_active: new_state })
    })
  }

  const user = useSelector(getUser)

  const move = (payload: any) => {
    // console.log(payload) 
    setClipboard(payload)
    // setMoveOpen(true)
  }

  const moveConfirm = () => {
    if(!clipboard || !department){
      return
    }

    if(clipboard["department"] == department){
      dispatch(setAlert({ title: "Nothing to change", mode: "normal", body: `Please select a different department`}))
    }else{
      dispatch(setAlert({ title: "Move Confirmation", mode: "normal", body: `Are you sure you want move ${clipboard["first_name"]} from ${departments?.find(d => d?.id == clipboard["department"])?.name} to ${departments?.find(d => d?.id == department)?.name}`, buttons: [<Button onClick={moveConsultant} contain title={"confirm transfer"} />] }))
    }
    
  }

  useEffect(()=>{
    clipboard && setDepartment(clipboard["department"])
  },[clipboard])

  return (
    !user?.email
      ?
      <Navigate to={"/"} />
      :
      JSON.parse(localStorage.getItem("TMS_USER"))?.role == "department_admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "company_admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "admin" ?
        <div>
          {/* header  */}
          <Header
            setOpen={setOpen}
            title="Board Member"
            count={employees?.length}
            heading="Board Member(s)"
          />

          {/* body  */}
          {employees?.length == 0 ? (
            <Text is_h1>No results found</Text>
          ) : (
            <Table
              // move={move}
              showBody={showBody}
              editor={editEmployee}
              setter={setter}
              setActive={setActive}
              columns={["email", "first_name", "last_name", "contact", "date_joined"]}
              rows={employees}
              delete
              toggle={toggleAccountState}
              edit
              view
            // redirect_path="/employee"
            />
          )}

          {open && (
            <Modal
              title={currentEmployee ? "Edit board member" : "Add board member"}
              content={
                <AddMember
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
          <Navigate to={"/"} />
        )
  );
};

export default employees;

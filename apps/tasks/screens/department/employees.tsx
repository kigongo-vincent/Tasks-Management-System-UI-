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
import AddEmployee from "../../components/add_employee";
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


  const moveConsultant = async() => {
    dispatch(setAlert({title: "Updating consultant...", body: "please stand by, transfer in progress...", mode: "normal"}))
    setLoading(true)

    const res = await fetch(`${server}/update_user/${clipboard["id"]}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        department: department
      })
    })

    if(res.status == 200){
      setLoading(false)
      setEmployees(employees?.filter(e => e?.id != clipboard["id"]))
      dispatch(setAlert({title: "Transfer success", body: `${clipboard["first_name"]} has been tranferred from ${departments?.find(d => d?.id == clipboard["department"])?.name} to ${departments?.find(d => d?.id == department)?.name}`, mode: "success"}))
      setClipboard(null)
    }else{
      dispatch(setAlert({title: "Transfer failed", body: "Something went wrong, please try again", mode: "error"}))
      setLoading(false)
    }


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
            title="consultant"
            count={employees?.length}
            heading="Consultant"
          />

          {/* body  */}
          {employees?.length == 0 ? (
            <Text is_h1>No results found</Text>
          ) : (
            <Table
              move={move}
              showBody={showBody}
              editor={editEmployee}
              setter={setter}
              setActive={setActive}
              columns={["email", "contact", "date_joined"]}
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

          {/* modal for viewing details about the employee  */}
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
                    {details["first_name"] + " " + details["last_name"]}
                  </Text>
                  <br />
                  <br />
                  {/* <hr style={{opacity: .3}}/> */}
                  {/* <br /> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaEnvelope style={{ marginRight: 10 }} color={theme?.text} />
                    <Text justify>{details["email"]}</Text>
                  </div>
                  <br />
                  <hr style={{ opacity: .4 }} />
                  <br />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaPhone style={{ marginRight: 10 }} color={theme?.text} />
                    <Text justify>{details["contact"]}</Text>
                  </div>
                </div>
              }
              title="User details"
            />
          )}

          {/* modal for moving the employee  */}
          {clipboard && (
            <Modal
              open={Boolean(clipboard)}
              setOpen={setClipboard}
              content={
                <div>
                  <Text
                    // color="primary" 
                    is_h1
                    heading
                    justify>
                    {clipboard["first_name"] + " " + clipboard["last_name"]}
                  </Text>
                  <br />
                  {/* <br /> */}
                  {/* <hr style={{opacity: .3}}/> */}
                  {/* <br /> */}
                  <Text>{`Move ${clipboard["first_name"]} to another department`}</Text>
                  <br />

                  {/* department options  */}
                  <br />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
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
                    {departments?.map((department) => (
                      <option value={department?.id}>{department?.name}</option>
                    ))}
                  </select>
                  <br />

                  <Button
                    fullwidth
                    title={"Confirm move"}
                    onClick={moveConfirm}
                    loading={loading}
                  />
                  {/* <hr style={{ opacity: .4 }} /> */}
                  <br />

                </div>
              }
              title="Move consultant"
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

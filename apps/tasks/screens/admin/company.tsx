import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { FaCirclePlus, FaEye, FaPen } from "react-icons/fa6";
import { getTheme, SERVER_URL, setAlert, setLoadingState } from "../../model/data";
import { useDispatch, useSelector } from "react-redux";
import { Theme, User } from "../../types";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../components/input";
import Button from "../../components/button";
import Table from "../../components/table";
import Header from "../../components/header";
import Modal from "../../components/modal"
import AddDepartment from "../../components/add_department";
import { DELETE, GET } from "../../utils/HTTP";



const company = () => {
  // company details
  // departments in the company
  // adding a new department

  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);
  const [departments, setDepartments] = useState<any[]>([]);
  const { id } = useParams();
  const dispatch = useDispatch()
  const [currentDepartment, setCurrentDepartment] = useState(null)

  const [company, setCompany] = useState({
    name: "",
    admin: "",
  });

  const { state } = useLocation();
  const [loading, setLoading] = useState(false)

  const setCompanyData = () => {
    setCompany({
      name: state?.name,
      admin: state?.admin_email,
    });
  };

  useEffect(()=>{
    dispatch(setLoadingState(loading))
  },[loading])


  const addDepartment = (new_department: any) => {
    setDepartments([...departments, new_department]);
  };

  useEffect(() => {
    setCompanyData();
    GET({path: "/departments/" + id, setData: setDepartments, setLoading: setLoading})
  }, []);

  const setter=(id)=>{
    dispatch(setAlert({title: "", body: "", mode: "normal"}))
    DELETE({data: departments, setData: setDepartments, path: "/department/" + id,id: id })
  }

  useEffect(()=>{

    if(!open){
      setCurrentDepartment(null)
    }

  }, [open])

  const editDepartment =(row)=>{
    setCurrentDepartment(row)
    setOpen(true)
  }

  const updateDepartment=(payload)=>{
    setDepartments(departments?.map(department => department["id"] == payload["id"] ? payload : department))
  }

  return (
    JSON.parse(localStorage.getItem("TMS_USER"))?.role == "admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "company_admin" ? 
    <div>
      {/* header  */}
      <Header
        title="department"
        setOpen={setOpen}
        count={departments?.length}
        heading="Departments"
      />

      {/* body  */}
      {
        departments?.length == 0
        ?
        <Text is_h1>No results found</Text>
        :
        <Table
        editor={editDepartment}
        setter={setter}
        columns={["name", "admin_email"]}
        rows={departments}
        delete
        edit
        view
        redirect_path="/department"
      />
      }

      {open && <Modal title={currentDepartment ? "Edit department" : "Add department"} open={open}  setOpen={setOpen} content={<AddDepartment updateDept={updateDepartment} values={currentDepartment && currentDepartment}  add={addDepartment} setOpen={setOpen}/>}/>
      }
    </div>
    :
    (
      <Navigate to={"/"}/>
    ) 
  );
};

export default company;

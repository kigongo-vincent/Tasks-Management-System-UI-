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
import AddProject from "../../components/add_project";
import { DELETE, GET } from "../../utils/HTTP";
import { decryptData, encryptData } from "../../utils/security";



const projects = () => {
  // projects details
  // departments in the projects
  // adding a new department

  const theme: Theme = useSelector(getTheme);
  const [open, setOpen] = useState(false);
  const server = useSelector(SERVER_URL);
  const [projects, setProjects] = useState<any[]>([]);
  let { id } = useParams();
  id = decryptData(id)
  const dispatch = useDispatch()
  const [currentProject, setCurrentProject] = useState(null)

  const { state } = useLocation();
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    dispatch(setLoadingState(loading))
  },[loading])


  const addProject = (new_project: any) => {
    setProjects([...projects, new_project]);
  };

  useEffect(() => {
    GET({path: "/projects/" + id, setData: setProjects, setLoading: setLoading})
  }, []);

  const setter=(id)=>{
    dispatch(setAlert({title: "", body: "", mode: "normal"}))
    DELETE({data: projects, setData: setProjects, path: "/project/" + id,id: id })
  }

  useEffect(()=>{

    if(!open){
      setCurrentProject(null)
    }

  }, [open])

  const editProject =(row)=>{
    setCurrentProject(row)
    setOpen(true)
  }

  const updateProject=(payload)=>{
    setProjects(projects?.map(project => project["id"] == payload["id"] ? payload : project))
  }

  return (
    JSON.parse(localStorage.getItem("TMS_USER"))?.role == "admin" || JSON.parse(localStorage.getItem("TMS_USER"))?.role == "company_admin" ? 
    <div>
      {/* header  */}
      <Header
        title="project"
        setOpen={setOpen}
        count={projects?.length}
        heading="projects"
      />

      {/* body  */}
      {
        projects?.length == 0
        ?
        <Text is_h1>No results found</Text>
        :
        <Table
        editor={editProject}
        setter={setter}
        columns={["name"]}
        rows={projects}
        delete
        edit
        // view
        // redirect_path="/department"
      />
      }

      {open && <Modal title={currentProject ? "Edit project" : "Add project"} open={open}  setOpen={setOpen} content={<AddProject updateProject={updateProject} values={currentProject && currentProject}  add={addProject} setOpen={setOpen}/>}/>
      }
    </div>
    :
    (
      <Navigate to={"/"}/>
    ) 
  );
};

export default projects;

import React, { useEffect, useState } from 'react'
import { FaBars, FaChartBar, FaHotel, FaList, FaLock, FaSignOutAlt, FaUserAlt } from 'react-icons/fa'
import Text from "./text"
import { useDispatch, useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser, setAlert, setUser } from '../model/data'
import {motion} from "framer-motion"
import { Company, Department, Theme, User } from '../types'
import Button from "./button"
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheckDouble, FaCheckToSlot, FaListCheck, FaPeopleGroup } from 'react-icons/fa6'
import { IoSettingsSharp } from "react-icons/io5";
const sidebar = () => {

  const theme:Theme = useSelector(getTheme)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user: User = useSelector(getUser)
  const company:Company = useSelector(getCompany)
  const department:Department = useSelector(getDepartment)

  const adminOptions=[
    // {
    //   icon: <FaChartBar style={{marginRight: 10}} />,
    //   label: "Dashboard",
    //   link: "/admin",
    // },
    {
      icon: <FaHotel style={{marginRight: 10}}/>,
      label: "View companies",
      link: "/admin/companies"
    },
    // {
    //   icon: <FaUserAlt style={{marginRight: 10}}/>,
    //   label: "view all users",
    //   link: "/admin/users"
    // },
    {
      icon: <FaLock style={{marginRight: 10}}/>,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
  ]

  const companyOptions=[
    // {
    //   icon: <FaChartBar style={{marginRight: 10}}/>,
    //   label: "Dashboard",
    //   link: "/company/",
    // },
    {
      icon: <FaPeopleGroup style={{marginRight: 10}}/>,
      label: "View all departments",
      link: "/admin/company/" + company?.id
    },
    {
      icon: <FaBars style={{marginRight: 10}}/>,
      label: "View all projects",
      link: "/admin/projects/" + company?.id
    },
    {
      icon: <FaLock style={{marginRight: 10}}/>,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
  ]

  const departmentOptions = [
    // {
    //   icon: <FaChartBar style={{marginRight: 10}}/>,
    //   label: "Dashboard",
    //   link: "/department/",
    // },
    {
      icon: <FaHotel style={{marginRight: 10}}/>,
      label: "View all Consultants",
      link: "/department/" + department?.id
    },
    
    {
      icon: <FaLock style={{marginRight: 10}}/>,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
  ]

  const employeeOptions = [
    {
      icon: <FaCheckToSlot style={{marginRight: 10}}/>,
      label: "View all tasks",
      link: "/employee/" + user?.user_id
    },
    {
      icon: <FaListCheck style={{marginRight: 10}}/>,
      label: "Draft",
      link: "/employee/saved_tasks/" + user?.user_id
    },
    {
      icon: <FaCheckDouble style={{marginRight: 10}}/>,
      label: "Today's todo List",
      link: "/employee/todos/" + user?.user_id
    },
    {
      icon: <FaLock style={{marginRight: 10}} />,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
  ]

  const [options, setOptions] = useState<any[]>([])

  const {pathname} = useLocation()

  const setUserOtions=()=>{
    switch(user?.role){
      case "admin":
        setOptions(adminOptions)
        break;
      case 'company_admin':
        setOptions(companyOptions)
        break
      case 'department_admin':
        setOptions(departmentOptions)
        break    
      case 'employee':
        setOptions(employeeOptions)
        break
      default:
        break    
    }
  }

  useEffect(()=>{

    setUserOtions()


  },[])

  return (
    <div 
    className='d-none'
    style={{background: theme?.paper,
      // , overflowY: "scroll",
      // boxShadow: "10px 10px 20px rgba(50,50,50,.05)",
      width: "max-conent",
      height: "100%",
      borderRadius: 3,
    }}>

    {/* links  */}

   <div style={{padding: 20, width: "100%"}}>
   {
      options?.map(option=> (
        <motion.div

        // onHoverStart={()=>console.log("focused")}
        // onHoverEnd={()=>console.log("ended")}
        onClick={option?.action ? option?.action : ()=>navigate(option?.link)}
        whileHover={{backgroundColor: theme?.pale}}
        // whileTap={{backgroundColor: theme?.paper}}
        // 
        style={{display: "flex", cursor: "pointer", width: "max-content", backgroundColor: theme?.paper, alignItems: "center", padding: 12, borderRadius:3}}>
      <div style={{color: pathname == option?.link ? theme?.name == "light" ? theme?.primary : "orange" : theme?.text}}>
      {option?.icon}
      </div>
      <Text color={pathname == option?.link ? "primary" : "text"}>{option?.label}</Text>
     </motion.div>
      ))
    }
   </div>

    </div>
  )
}

export default sidebar

import React, { useEffect, useState } from 'react'
import { FaBars, FaChartBar, FaHotel, FaList, FaLock, FaSignOutAlt, FaUserAlt, FaUsers } from 'react-icons/fa'
import Text from "./text"
import { useDispatch, useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser, setAlert, setUser } from '../model/data'
import {motion} from "framer-motion"
import { Company, Department, Theme, User } from '../types'
import Button from "./button"
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheckDouble, FaCheckToSlot, FaListCheck, FaPeopleGroup, FaPeopleRoof } from 'react-icons/fa6'
import { IoSettingsSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import {encryptData} from "../utils/security"
import NavbarLink from './navbar_link'
import { BsPeopleFill } from "react-icons/bs";
import { MdSupervisedUserCircle } from "react-icons/md";
import { MdOutlineWorkHistory } from "react-icons/md";

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
      icon: <HiUserGroup style={{marginRight: 10}}/>,
      label: "View all consultants",
      link: "/admin/users/" + encryptData(company?.id)
    },
    {
      icon: <MdSupervisedUserCircle style={{marginRight: 10}}/>,
      label: "Board members",
      link: "/admin/members/" + encryptData(company?.id)
    },
    {
      icon: <FaPeopleRoof style={{marginRight: 10}}/>,
      label: "View all departments",
      link: "/admin/company/" + encryptData(company?.id)
    },
    {
      icon: <FaBars style={{marginRight: 10}}/>,
      label: "View all projects",
      link: "/admin/projects/" + encryptData(company?.id)
    },
    {
      icon: <MdOutlineWorkHistory style={{marginRight: 10}}/>,
      label: "Logs",
      link: "/admin/logs/" + encryptData(company?.id)
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
  ]

  const memberOptions=[
    // {
    //   icon: <FaChartBar style={{marginRight: 10}}/>,
    //   label: "Dashboard",
    //   link: "/company/",
    // },
    {
      icon: <HiUserGroup style={{marginRight: 10}}/>,
      label: "View all consultants",
      link: "/admin/users/" + encryptData(user?.username?.slice(0, 1))
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
      icon: <BsPeopleFill style={{marginRight: 10}}/>,
      label: "Consultants",
      link: "/department/users/" + encryptData(department?.id)
    },
    {
      icon: <FaUsers style={{marginRight: 10}}/>,
      label: "View all Consultants",
      link: "/department/" + encryptData(department?.id)
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
      link: "/employee/" + encryptData(user?.user_id)
    },
    {
      icon: <FaListCheck style={{marginRight: 10}}/>,
      label: "Draft",
      link: "/employee/saved_tasks/" + encryptData(user?.user_id)
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
      case "company_member":
        setOptions(memberOptions)
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
      // width: "max-conent",
      // backgroundColor: "red",
      // alignItems: "stretch",
      height: "100%",
      transition: ".2s",
      borderRadius: 3,
    }}>

    {/* links  */}

   <div style={{padding: 20, width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch"}}>
   {
      options?.map((option, index)=> (
        <NavbarLink option={option} key={index}/>
      ))
    }
   </div>

    </div>
  )
}

export default sidebar

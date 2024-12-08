import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser } from '../model/data'
import { Theme } from '../types'
import { FaBars, FaCheckDouble, FaHotel, FaList, FaLock, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa'
import { FaCheckToSlot, FaListCheck, FaPeopleGroup, FaPeopleRoof, FaToolbox } from 'react-icons/fa6'
import Tab from "./tab_link"
import { IoSettingsSharp } from 'react-icons/io5'
import {encryptData} from "../utils/security"
import { HiUserGroup } from 'react-icons/hi'
import { MdSupervisedUserCircle } from 'react-icons/md'
import { BsPeopleFill } from 'react-icons/bs'

const tabs = () => {

  const theme:Theme = useSelector(getTheme)

  const company = useSelector(getCompany)
  const user = useSelector(getUser)
  const department = useSelector(getDepartment)
  const [options, setOptions] = useState<any[]>([])
  

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


  return (
    <div className='bottom-navbar' style={{background: theme?.paper, padding: "19px 10px"}}>
      {
        options?.map(option=> <Tab icon={option?.icon} label={option?.label} link={option?.link}/>)
      }
    </div>
  )
}

export default tabs

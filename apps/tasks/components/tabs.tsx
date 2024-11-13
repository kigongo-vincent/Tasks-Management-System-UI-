import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser } from '../model/data'
import { Theme } from '../types'
import { FaBars, FaHotel, FaList, FaLock, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import Tab from "./tab_link"

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
    //   icon: <FaChartBar size={19} style={{marginRight: 10}} />,
    //   label: "Dashboard",
    //   link: "/admin",
    // },
    {
      icon: <FaHotel size={19} style={{marginRight: 10}} />,
      label: "View all companies",
      link: "/admin/companies"
    },
    // {
    //   icon: <FaUserAlt size={19} style={{marginRight: 10}} />,
    //   label: "view all users",
    //   link: "/admin/users"
    // },
    {
      icon: <FaLock size={19} style={{marginRight: 10}} />,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <FaSignOutAlt size={19} style={{marginRight: 10}} />,
      label: "Logout",
      // link: "/logout"
    },
    {
      icon: <FaUser size={19} style={{marginRight: 10}} />,
      label: "profile",
      link: "/profile"
    },
  ]

  const companyOptions=[
    // {
    //   icon: <FaChartBar size={19} style={{marginRight: 10}} />,
    //   label: "Dashboard",
    //   link: "/company/",
    // },
    {
      icon: <FaPeopleGroup size={19} style={{marginRight: 10}} />,
      label: "View all departments",
      link: "/admin/company/" + company?.id
    },
    {
      icon: <FaBars style={{marginRight: 10}} color={theme?.text}/>,
      label: "View all projects",
      link: "/admin/projects/" + company?.id
    },
    {
      icon: <FaLock size={19} style={{marginRight: 10}} />,
      label: "Change password",
      link: "/change_password"
    }
    ,
    {
      icon: <FaSignOutAlt size={19} style={{marginRight: 10}} />,
      label: "Logout",
      // link: "/logout"
    },
    {
      icon: <FaUser size={19} style={{marginRight: 10}} />,
      label: "profile",
      link: "/profile"
    },
  ]

  const departmentOptions = [
    // {
    //   icon: <FaChartBar size={19} style={{marginRight: 10}} />,
    //   label: "Dashboard",
    //   link: "/department/",
    // },
    {
      icon: <FaHotel size={19} style={{marginRight: 10}} />,
      label: "View all employees",
      link: "/department/" + department?.id
    },
    {
      icon: <FaLock size={19} style={{marginRight: 10}} />,
      label: "Change password",
      link: "/change_password"
    }
    ,
    {
      icon: <FaSignOutAlt size={19} style={{marginRight: 10}} />,
      label: "Logout",
      // link: "/logout"
    },
    {
      icon: <FaUser size={19} style={{marginRight: 10}} />,
      label: "profile",
      link: "/profile"
    },
  ]

  const employeeOptions = [
    {
      icon: <FaList size={19} style={{marginRight: 10}} />,
      label: "View all tasks",
      link: "/employee/" + user?.user_id
    },
    {
      icon: <FaLock size={19} style={{marginRight: 10}} />,
      label: "Change password",
      link: "/change_password"
    }
    ,
    {
      icon: <FaSignOutAlt size={19} style={{marginRight: 10}} />,
      label: "Logout",
      // link: "/logout"
    },
    {
      icon: <FaUser size={19} style={{marginRight: 10}} />,
      label: "profile",
      link: "/profile"
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

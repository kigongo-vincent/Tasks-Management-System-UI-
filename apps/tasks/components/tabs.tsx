import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser } from '../model/data'
import { Theme } from '../types'
import { FaBars, FaCheckDouble, FaHotel, FaList, FaLock, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { FaCheckToSlot, FaListCheck, FaPeopleGroup, FaToolbox } from 'react-icons/fa6'
import Tab from "./tab_link"
import { IoSettingsSharp } from 'react-icons/io5'

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
      icon: <FaLock style={{marginRight: 10}}/>,
      label: "Change password",
      link: "/change_password"
    },
    {
      icon: <IoSettingsSharp style={{marginRight: 10}}/>,
      label: "settings",
      link: "/admin/settings"
    },
    {
      icon: <FaSignOutAlt/>,
      label: "Logout"
    }
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
    {
      icon: <FaSignOutAlt/>,
      label: "Logout",
      
    }
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
    {
      icon: <FaSignOutAlt/>,
      label: "Logout",
      
    }
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
    // {
    //   icon: <FaCheckDouble style={{marginRight: 10}}/>,
    //   label: "Today's todo List",
    //   link: "/employee/todos/" + user?.user_id
    // },
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
    {
      icon: <FaSignOutAlt/>,
      label: "Logout",
      
    }
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

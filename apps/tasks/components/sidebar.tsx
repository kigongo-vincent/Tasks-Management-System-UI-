import React, { useEffect, useState } from 'react'
import { FaChartBar, FaHotel, FaList, FaLock, FaSignOutAlt, FaUserAlt } from 'react-icons/fa'
import Text from "./text"
import { useDispatch, useSelector } from 'react-redux'
import { getCompany, getDepartment, getTheme, getUser, setAlert, setUser } from '../model/data'
import {motion} from "framer-motion"
import { Company, Department, Theme, User } from '../types'
import Button from "./button"
import { useNavigate } from 'react-router-dom'
import { FaPeopleGroup } from 'react-icons/fa6'

const sidebar = () => {

  const theme:Theme = useSelector(getTheme)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user: User = useSelector(getUser)
  const company:Company = useSelector(getCompany)
  const department:Department = useSelector(getDepartment)

  const adminOptions=[
    // {
    //   icon: <FaChartBar style={{marginRight: 10}} color={theme?.text}/>,
    //   label: "Dashboard",
    //   link: "/admin",
    // },
    {
      icon: <FaHotel style={{marginRight: 10}} color={theme?.text}/>,
      label: "View all companies",
      link: "/admin/companies"
    },
    // {
    //   icon: <FaUserAlt style={{marginRight: 10}} color={theme?.text}/>,
    //   label: "view all users",
    //   link: "/admin/users"
    // },
    {
      icon: <FaLock style={{marginRight: 10}} color={theme?.text}/>,
      label: "Change password",
      link: "/change_password"
    }
  ]

  const companyOptions=[
    // {
    //   icon: <FaChartBar style={{marginRight: 10}} color={theme?.text}/>,
    //   label: "Dashboard",
    //   link: "/company/",
    // },
    {
      icon: <FaPeopleGroup style={{marginRight: 10}} color={theme?.text}/>,
      label: "View all departments",
      link: "/admin/company/" + company?.id
    },
    {
      icon: <FaLock style={{marginRight: 10}} color={theme?.text}/>,
      label: "Change password",
      link: "/change_password"
    }
  ]

  const departmentOptions = [
    // {
    //   icon: <FaChartBar style={{marginRight: 10}} color={theme?.text}/>,
    //   label: "Dashboard",
    //   link: "/department/",
    // },
    {
      icon: <FaHotel style={{marginRight: 10}} color={theme?.text}/>,
      label: "View all employees",
      link: "/department/" + department?.id
    },
    {
      icon: <FaLock style={{marginRight: 10}} color={theme?.text}/>,
      label: "Change password",
      link: "/change_password"
    }
  ]

  const employeeOptions = [
    {
      icon: <FaList style={{marginRight: 10}} color={theme?.text}/>,
      label: "View all tasks",
      link: "/employee/" + user?.user_id
    },
    {
      icon: <FaLock style={{marginRight: 10}} color={theme?.text}/>,
      label: "Change password",
      link: "/change_password"
    }
  ]

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

  return (
    <div 
    className='d-none'
    style={{background: theme?.paper,
      // , overflowY: "scroll",
      boxShadow: "10px 10px 20px rgba(50,50,50,.05)",
      width: "24%",
      height: "100%",
      borderRadius: 10,
    }}>

    {/* links  */}

   <div style={{padding: 20}}>
   {
      options?.map(option=> (
        <motion.div 
        onClick={option?.action ? option?.action : ()=>navigate(option?.link)}
        whileHover={{backgroundColor: theme?.pale}}
        whileTap={{backgroundColor: theme?.paper}}
        style={{display: "flex", cursor: "pointer", backgroundColor: theme?.paper, alignItems: "center", padding: 15, borderRadius:10}}>
      {option?.icon}
      <Text>{option?.label}</Text>
     </motion.div>
      ))
    }
   </div>

    </div>
  )
}

export default sidebar

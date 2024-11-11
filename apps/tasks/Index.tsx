import React, { useEffect, useState } from 'react'

// screens 
import {Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom"
import AdminRouter from "./screens/admin/router"
import CompanyRouter from "./screens/company/router"
import DepartmentRouter from "./screens/department/router"
import EmployeeRouter from "./screens/employee/router"
import AuthRouter from "./screens/auth/router"
import "./app.css"
import AlertComponent from "./components/alert"
import { Alert, Theme } from './types'
import { useDispatch, useSelector } from 'react-redux'
import { alert_msg, allowHide, getHide, getTheme, loadingState, setAlert } from './model/data'
import Loader from "./components/loader"
import { FaBackspace } from 'react-icons/fa'
import Text from "./components/text"

const Index = () => {

  const alert: Alert = useSelector(alert_msg)
  const loading = useSelector(loadingState)
  const dispatch = useDispatch()
  const hide = useSelector(getHide)

  // useEffect(()=>{
  //   if(alert?.title && !alert?.buttons){
  //     setTimeout(() => {
  //       dispatch(setAlert({title: "", mode: "", body: ""}))
  //     }, 1500);
  //   }
  // },[alert?.title])
  // useEffect(()=>{
  //   if(hide){
  //     if(!alert?.buttons){
  //       setTimeout(() => {
  //         dispatch(setAlert({title: "", mode: "", body: ""}))
  //       }, 1500);
  //     }
  //   }
  // },[alert?.title, hide])


  // useEffect(()=>{

  //   if(!alert?.title){
  //     dispatch(allowHide())
  //   }

  // },[alert?.title])

  useEffect(()=>{
    console.log(hide)
  },[hide])

  const theme: Theme = useSelector(getTheme)
  const {pathname} = useLocation()

  const navigate = useNavigate()

  

  return (
    <div>

    <Routes>
      <Route path='/*' Component={AuthRouter}/>
      <Route path='/admin/*' Component={AdminRouter}/>
      <Route path='/company/*' Component={CompanyRouter}/>
      <Route path='/department/*' Component={DepartmentRouter}/>
      <Route path='/employee/*' Component={EmployeeRouter}/>
      <Route path='*' element={<Navigate to="/"/>}/>

      
    </Routes>
    {
      alert?.title
      &&
      <AlertComponent mode={alert?.mode} title={alert?.title} body={alert?.body} buttons={alert?.buttons} icon={alert?.icon}/>
    }
    {
      loading && <Loader/>
    }
    </div>
  )
}

export default Index

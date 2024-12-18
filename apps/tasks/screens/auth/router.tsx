import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from "./login"
import ChangePassword from "./change_password"
import Profile from "./profile"

const router = () => {
  return (
    <Routes>
      <Route path='/' Component={LoginPage}/>
      <Route path='/change_password' Component={ChangePassword}/>
      <Route path='/profile' Component={Profile}/>
      <Route path='*' element={<Navigate to="/"/>}/>
    </Routes>
  )
}

export default router

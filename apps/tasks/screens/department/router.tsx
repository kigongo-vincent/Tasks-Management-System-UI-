import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeesPage from "./employees"
import UsersPage from "./users"
import Layout from "../../components/layout"

const router = () => {
  return (
    <Layout>
    <Routes>
      <Route path='/:id' Component={EmployeesPage}/>
      <Route path='/users/:id' Component={UsersPage}/>
      <Route path='*' element={<Navigate to="/"/>}/>
    </Routes>
    </Layout>
  )
}

export default router

import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TasksPage from "./tasks"
import TodosPage from "./todo"
import SavedTasksPage from "./saved_tasks"
import Layout from "../../components/layout"

const router = () => {
  return (
    <Layout>
    <Routes>
      <Route path='/:id' Component={TasksPage}/>
      <Route path='/todos/:id' Component={TodosPage}/>
      <Route path='saved_tasks/:id' Component={SavedTasksPage}/>
    </Routes>
    </Layout>
  )
}

export default router

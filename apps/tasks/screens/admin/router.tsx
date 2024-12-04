import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./index";
import CompaniesPage from "./companies";
import CompanyPage from "./company";
import UsersPage from "./users";
import { Theme } from "../../types";
import { useSelector } from "react-redux";
import { getTheme, getUser } from "../../model/data";
import Layout from "../../components/layout";
import ProjectsPage from "./projects"
import Settings from "./settings"

const router = () => {

  const user = useSelector(getUser)

  return (
    !user?.email
    ?
    <Navigate to={"/"}/>
    :
    <Layout>
      <Routes>
        <Route path="/" Component={Dashboard} />
        <Route path="/companies" Component={CompaniesPage} />
        <Route path="/company/:id" Component={CompanyPage} />
        <Route path="/users/:id" Component={UsersPage} />
        <Route path="/projects/:id" Component={ProjectsPage}/>
        <Route path="/settings" Component={Settings}/>
      <Route path='*' element={<Navigate to="/"/>}/>

      </Routes>
    </Layout>
  );
};

export default router;

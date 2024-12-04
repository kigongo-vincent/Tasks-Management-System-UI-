// @ts-nocheck
import React, { useEffect, useState } from "react";
import Background from "../../components/background";
import XStack from "../../components/x_stack";
import { Theme, User } from "../../types";
import {
  getTheme,
  SERVER_URL,
  setAlert,
  setCompany,
  setDepartment,
  setUser,
} from "../../model/data";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/icons/logo.svg";
import Input from "../../components/input";
import Button from "../../components/button";
import Text from "../../components/text";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { encryptData } from "../../utils/security";
const login = () => {
  const theme: Theme = useSelector(getTheme);
  const server = useSelector(SERVER_URL);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [width, setWidth] = useState(0)

  const [email, setEmail] = useState({
    value: "",
    error: "invalid email",
  });

  const [password, setPassword] = useState({
    value: "",
    error: "",
  });

  const fetchDepartment = async (user_id) => {
    setLoading(true);
    const res = await fetch(`${server}/get_department/${user_id}`);
    if (res.status == 200) {
      const data = await res.json();
      dispatch(setDepartment(data));
      navigate(`/department/${encryptData(data?.id)}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const fetchCompany = async (user_id) => {
    setLoading(true);
    const res = await fetch(`${server}/get_company/${user_id}`);
    if (res.status == 200) {
      const data = await res.json();
      dispatch(setCompany(data));
      navigate(`/admin/company/${encryptData(data?.id)}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email.value || !password.value) {
      dispatch(
        setAlert({
          title: "Empty fields",
          body: "Please fill out all form fields before proceeding",
          mode: "error",
        })
      );
      return;
    }

    setLoading(true);
    const res = await fetch(`${server}/token/`, {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password?.value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.status == 200) {
      const data = await res.json();
      const decrypted_data: User = jwtDecode(data?.access);

      if (decrypted_data) {
        const loggedin_user: User = {
          email: decrypted_data?.email,
          user_id: decrypted_data?.user_id,
          role: decrypted_data?.role,
          company: decrypted_data?.company,
          tokens: {
            access: data?.access,
            refresh: data?.refresh,
          },
        };

        if (loggedin_user?.role == "company_admin") {
          await fetchCompany(loggedin_user?.user_id);
        } else if (loggedin_user?.role == "department_admin") {
          await fetchDepartment(loggedin_user?.user_id);
        } else if (loggedin_user?.role == "admin") {
          navigate(`/admin/companies`);
        } else {
          navigate(`/employee/${encryptData(loggedin_user?.user_id)}`);
        }
        dispatch(setUser(loggedin_user));
        dispatch(
          setAlert({
            title: "Login success",
            body: "You have been logged in successfully",
            mode: "success",
          })
        );
      }

      setLoading(false);
    } else {
      setLoading(false);
      dispatch(
        setAlert({
          title: "Login Failed",
          body: "Please try again with the correct credentials",
          mode: "error",
        })
      );
    }
  };

  return JSON.parse(localStorage.getItem("TMS_USER"))?.role == "employee" ? (
    <Navigate
      to={"/employee/" + encryptData(JSON.parse(localStorage.getItem("TMS_USER"))?.user_id)}
    />
  ) : JSON.parse(localStorage.getItem("TMS_USER"))?.role == "company_admin" ? (
    <Navigate
      to={
        "/admin/users/" + encryptData(JSON.parse(localStorage.getItem("TMS_COMPANY"))?.id)
      }
    />
  ) : JSON.parse(localStorage.getItem("TMS_USER"))?.role ==
    "department_admin" ? (
    <Navigate
      to={
        "/department/users/" + encryptData(JSON.parse(localStorage.getItem("TMS_DEPARTMENT"))?.id)
      }
    />
  ) : JSON.parse(localStorage.getItem("TMS_USER"))?.role == "admin" ? (
    <Navigate to={"/admin/companies"} />
  ) : (
    <Background>
      <XStack>
        {/* empty container  */}
        {
          <div className="login-empty-container" />
        }
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={onSubmit}
          className="login-main-container"
          style={{
            
            borderRadius: 4,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
            background: theme.paper,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img src={Logo} alt="" height={70} />
          <br />
          <Text heading>Login</Text>
          <br />
          <br />
          {/* email  */}
          <Input
            fullwidth
            input={email}
            type={"email"}
            placeholder={"email"}
            setter={setEmail}
          />
          <br />
          {/* <br /> */}
          <Input
            fullwidth
            input={password}
            type={"password"}
            placeholder={"password"}
            setter={setPassword}
          />
          <br />
          <Button
            fullwidth
            title={"Login"}
            onClick={onSubmit}
            loading={loading}
          />
        </motion.form>
      </XStack>
    </Background>
  );
};

export default login;

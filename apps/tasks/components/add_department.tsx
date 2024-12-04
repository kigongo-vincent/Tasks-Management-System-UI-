import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTheme, SERVER_URL, setAlert } from "../model/data";
import { Theme } from "../types";
import Input from "./input";
import Button from "./button";
import Text from "./text";
import { verifyPassword } from "../utils/password_checker";
import { decryptData, encryptData } from "../utils/security";

export interface Props {
  setOpen: (open: boolean) => void;
  add?: (data: any) => void;
  values?: any;
  updateDept: any;
  updateAdmin: any
}

const add_department = (props: Props) => {
  const theme: Theme = useSelector(getTheme);
  const dispatch = useDispatch();

  const [name, setName] = useState({
    value: "",
    error: null,
  });
  const [email, setEmail] = useState({
    value: "",
    error: null,
  });
  const [password, setPassword] = useState({
    value: "",
    error: null,
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState({
    value: "",
    error: null,
  });
  const [fName, setFName] = useState({
    value: "",
    error: null
  })
  const [lName, setLName] = useState({
    value: "",
    error: null
  })
  const [contact, setContact] = useState({
    value: "",
    error: null
  })

  const [loading, setLoading] = useState(false);
  const server = useSelector(SERVER_URL);
  let { id } = useParams();
  id = decryptData(id)

  useEffect(() => {
    // setEmail({...email, value: props?.values["email"]})
    // console.log(props?.values);
    if (props?.values) {
      setName({ ...name, value: props?.values["name"] });
      setEmail({ ...email, value: props?.values["admin_email"] });
      setContact({ ...contact, value: props?.values["admin_contact"] });
      setFName({ ...fName, value: props?.values["admin_first_name"] });
      setLName({ ...lName, value: props?.values["admin_last_name"] });
    }
  }, [props?.values]);

  const onSubmit = async (e) => {
    e.preventDefault();

    

    if (!props?.values) {
      if (!email.value || !password?.value || !name?.value || !contact?.value || !fName?.value || !lName?.value) {
        dispatch(
          setAlert({
            title: "Empty form fields",
            body: "Ensure you fillout all form fields befor submitting",
            mode: "error",
          })
        );
        return;
      }

      if (!verifyPassword(password.value)) {
        dispatch(
          setAlert({
            title: "Weak password",
            body: "password must contain 1 number, a lowecase, uppercase and special character",
            mode: "error",
          })
        );
        return;
      }

      if (password?.value != passwordConfirmation?.value) {
        dispatch(
          setAlert({
            title: "Unmatching password",
            body: "Please provide matching passwords",
            mode: "error",
          })
        );
        return;
      }

      setLoading(true);
      const res = await fetch(`${server}/department_admins/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email?.value,
          password: password?.value,
          first_name: fName?.value,
          last_name: lName?.value,
          contact: contact?.value
        }),
      });

      if (res.status == 201) {
        const data = await res.json();
        dispatch(
          setAlert({
            title: "Department admin uploaded successfully",
            body: "User has been created Successfully, now uploading department...",
            mode: "success",
          })
        );
        uploadDepartment(data?.id);
      } else {
        dispatch(
          setAlert({
            title: "Failed to upload department admin",
            body: "Please try again with a different email",
            mode: "error",
          })
        );
        setLoading(false);
      }
    } else {
      update();
    }
  };

  const uploadDepartment = async (admin_id: number) => {
    const res = await fetch(`${server}/departments/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name?.value,
        admin: admin_id,
      }),
    });

    if (res.status == 201) {
      setLoading(false);
      const data = await res.json();
      dispatch(
        setAlert({
          title: "department uploaded successfully",
          body: "department has been created Successfully",
          mode: "success",
        })
      );
      props?.setOpen(false);
      props?.add && props?.add(data);
    } else {
      setLoading(false);
      dispatch(
        setAlert({
          title: "Department creation failed",
          body: "Department has not been uploaded, please try again and if this persists, contact the company admin",
          mode: "error",
        })
      );
    }
  };

  // ==============================================================

  const updateDepartment = async (payload: any) => {
    if (payload["admin"] || payload["name"]) {
      // console.log(payload);

      if (name?.value != props?.values["name"] && name?.value?.length > 3) {
        payload = { ...payload, name: name?.value };
      }

      const res = await fetch(`${server}/department/${props?.values["id"]}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status == 202) {
        const data = await res.json();
        props?.updateDept(data);
        props?.setOpen(false);
        if (payload["admin"]) {
          dispatch(
            setAlert({
              title: "Admin changed successfully",
              mode: "success",
              body: "The department has been allocated to a new admin",
            })
          );
        } else {
          dispatch(
            setAlert({
              title: "department name updated successfully",
              mode: "success",
              body: "The department name hase been updated successfully",
            })
          );
        }
        setLoading(false);
      } else {
        dispatch(
          setAlert({
            title: "Something went wrong",
            body: "Please try again",
            mode: "error",
          })
        );
        setLoading(false);
      }
    } else if (payload["password"]) {
      updateDepartmentAdmin(payload);
    }
  };

  const updateDepartmentAdmin = async (payload: any) => {
    const res = await fetch(`${server}/update_user/${props?.values["admin"]}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (res.status == 200) {
      props?.setOpen(false);
      dispatch(
        setAlert({
          title: "Password updated",
          body: "password has been updated successfully",
          mode: "success",
        })
      );
      setLoading(false);
      setPassword({ value: "", error: null });
      setPasswordConfirmation({ value: "", error: null });
    } else {
      dispatch(
        setAlert({
          title: "Password failed to be updated",
          body: "password has not been updated, please try again",
          mode: "error",
        })
      );
      setLoading(false);
    }
  };

  const uploadNewDepartmentAdmin = async () => {
    if (password?.value != passwordConfirmation?.value) {
      dispatch(
        setAlert({
          title: "Unmatching password",
          body: "Please provide matching passwords",
          mode: "error",
        })
      );
      return;
    }

    if (!verifyPassword(password.value)) {
      dispatch(
        setAlert({
          title: "Weak password",
          body: "password must contain 1 number, a lowecase, uppercase and special character",
          mode: "error",
        })
      );
      return;
    }
    setLoading(true);
    const res = await fetch(`${server}/department_admins/${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email?.value,
        password: password?.value,
      }),
    });

    if (res.status == 201) {
      const data = await res.json();
      fetch(`${server}/employee/${props?.values["admin"]}`, {
        method: "delete",
      });
      dispatch(
        setAlert({
          title: "Department admin uploaded successfully",
          body: "User has been created Successfully, now updating department...",
          mode: "success",
        })
      );
      updateDepartment({ admin: data?.id });
    } else {
      dispatch(
        setAlert({
          title: "Failed to upload department admin",
          body: "Please try again with a different email",
          mode: "error",
        })
      );
      setLoading(false);
    }
  };

  const update = async() => {
    if (
      name?.value == props?.values["name"] &&
      email?.value == props?.values["admin_email"] &&
      fName?.value == props?.values["admin_first_name"] &&
      lName?.value == props?.values["admin_last_name"] &&
      contact?.value == props?.values["admin_contact"] &&
      !password?.value
    ) {
      dispatch(
        setAlert({
          title: "Nothing to change",
          body: "No changes detected",
          mode: "normal",
        })
      );
      return;
    }

    // if (email?.value != props?.values["admin_email"]) {
    //   // change company admin
    //   uploadNewDepartmentAdmin();
    //   return;
    // }

    if (password?.value) {
      // change password
      if (password?.value != passwordConfirmation?.value) {
        dispatch(
          setAlert({
            title: "Unmatching password",
            body: "Please provide matching passwords",
            mode: "error",
          })
        );
        return;
      }

      if (!verifyPassword(password.value)) {
        dispatch(
          setAlert({
            title: "Weak password",
            body: "password must contain 1 number, a lowecase, uppercase and special character",
            mode: "error",
          })
        );
        return;
      }
      setLoading(true);
      updateDepartment({ password: password?.value });
    }

    if (name?.value != props?.values["name"]) {
      // change company name
      setLoading(true);
      updateDepartment({ name: name?.value });
    }

    if (email?.value && contact?.value && fName?.value && lName?.value) {
      // // change company admin
      // uploadNewCompanyAdmin();
      setLoading(true)
      const res = await fetch(`${server}/update_user/${props?.values["admin"]}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          email: email?.value,
          first_name: fName?.value,
          last_name: lName?.value,
          contact: contact?.value
        })
      })

      if(res.status == 200){

        setLoading(false)
        props?.updateAdmin(await res.json())
        props?.setOpen(false)
        dispatch(setAlert({title: "Update success", body: "The department representative has been updated successfully", mode: "success"}))

      }else{

        setLoading(false)
        dispatch(setAlert({title: "update failed", body: "failed to update the department representative", mode: "error"}))

      }
      
    }

  };

  // ==============================================================

  return (
    <form onSubmit={onSubmit}>
      <br />
      <Text>Department details</Text>

      <br />
      <br />
      <hr style={{opacity: .1}}/>
      <br />

      <Input
        noBorder
        fullwidth
        placeholder={"Department name"}
        type={"text"}
        setter={setName}
        input={name}
      />
      <br />
      <Text>Department Representative</Text>

      <br />
      <br />
      <hr style={{opacity: .1}}/>
      <br />

      <Input
        noBorder
        fullwidth
        placeholder={"department head email"}
        type={"email"}
        setter={setEmail}
        input={email}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"first name"}
        type={""}
        setter={setFName}
        input={fName}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"last name"}
        type={""}
        setter={setLName}
        input={lName}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"contact"}
        type={"number"}
        setter={setContact}
        input={contact}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"password"}
        type={"password"}
        setter={setPassword}
        input={password}
      />
      <br />
      <Input
        noBorder
        fullwidth
        placeholder={"password confirmation"}
        type={"password"}
        setter={setPasswordConfirmation}
        input={passwordConfirmation}
      />
      <br />
      <Button
        loading={loading}
        fullwidth
        onClick={onSubmit}
        title={props?.values ? "save changes" : "Add department"}
      />
    </form>
  );
};

export default add_department;

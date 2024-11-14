import React, { useEffect, useState } from "react";
import { Theme } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, SERVER_URL, setAlert } from "../model/data";
import { AnimatePresence, motion } from "framer-motion";
import Text from "./text";
import Input from "./input";
import Button from "./button";
import { verifyPassword } from "../utils/password_checker";
import { DELETE, UPDATE } from "../utils/HTTP";

export interface Props {
  setOpen: (open: boolean) => void;
  add: (data: any) => void;
  values?: any;
  updateCompany?: any;
  updateAdmin: any
}

const add_company = (props: Props) => {
  const theme: Theme = useSelector(getTheme);
  const dispatch = useDispatch();
  const [reset, setReset] = useState();
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

  const updateCompany = async (payload: any) => {
    if (payload["admin"] || payload["name"]) {
      // console.log(payload);

      if (name?.value != props?.values["name"] && name?.value?.length > 3) {
        payload = { ...payload, name: name?.value };
      }

      const res = await fetch(`${server}/company/${props?.values["id"]}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status == 202) {
        const data = await res.json();
        props?.updateCompany(data);
        props?.setOpen(false);
        if (payload["admin"]) {
          dispatch(
            setAlert({
              title: "Admin changed successfully",
              mode: "success",
              body: "The company has been allocated to a new admin",
            })
          );
        } else {
          dispatch(
            setAlert({
              title: "Company name updated successfully",
              mode: "success",
              body: "The company name hase been updated successfully",
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
      updateCompanyAdmin(payload);
    }
  };

  const updateCompanyAdmin = async (payload: any) => {
    const res = await fetch(`${server}/update_user/${props?.values["admin"]}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (res.status == 200) {
      props?.setOpen(false)
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
          body: "has not been updated, please try again",
          mode: "error",
        })
      );
      setLoading(false);
    }
  };

  // const uploadNewCompanyAdmin = async () => {
  //   if (password?.value != passwordConfirmation?.value) {
  //     dispatch(
  //       setAlert({
  //         title: "Unmatching password",
  //         body: "Please provide matching passwords",
  //         mode: "error",
  //       })
  //     );
  //     return;
  //   }

  //   if (!verifyPassword(password.value)) {
  //     dispatch(
  //       setAlert({
  //         title: "Weak password",
  //         body: "password must contain 1 number, a lowecase, uppercase and special character",
  //         mode: "error",
  //       })
  //     );
  //     return;
  //   }
  //   setLoading(true);
  //   const res = await fetch(`${server}/company_admins`, {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: email?.value,
  //       password: password?.value,
  //       first_name: fName?.value,
  //         last_name: lName?.value,
  //         contact: contact?.value
  //     }),
  //   });

  //   if (res.status == 201) {
  //     const data = await res.json();
  //     fetch(`${server}/employee/${props?.values["admin"]}`, {method: "delete"})
  //     dispatch(
  //       setAlert({
  //         title: "Company admin uploaded successfully",
  //         body: "User has been created Successfully, now updating company...",
  //         mode: "success",
  //       })
  //     );
  //     updateCompany({ admin: data?.id });
  //   } else {
  //     dispatch(
  //       setAlert({
  //         title: "Failed to upload Company admin",
  //         body: "Please try again with a different email",
  //         mode: "error",
  //       })
  //     );
  //     setLoading(false);
  //   }
  // };

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
      updateCompany({ password: password?.value });
    }

    if (name?.value != props?.values["name"]) {
      // change company name
      setLoading(true);
      updateCompany({ name: name?.value });
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
        dispatch(setAlert({title: "Update success", body: "The company representative has been updated successfully", mode: "success"}))

      }else{

        setLoading(false)
        dispatch(setAlert({title: "update failed", body: "failed to update the company representative", mode: "error"}))

      }
      
    }

    
  };

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
      const res = await fetch(`${server}/company_admins`, {
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
            title: "Company admin uploaded successfully",
            body: "User has been created Successfully, now uploading company...",
            mode: "success",
          })
        );
        uploadCompany(data?.id);
      } else {
        dispatch(
          setAlert({
            title: "Failed to upload Company admin",
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

  const uploadCompany = async (admin_id: number) => {
    const res = await fetch(`${server}/companies`, {
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
          title: "Company uploaded successfully",
          body: "Company has been created Successfully",
          mode: "success",
        })
      );
      props?.setOpen(false);
      props?.add(data);
    } else {
      setLoading(false);
      dispatch(
        setAlert({
          title: "Company creation failed",
          body: "Company has not been uploaded, please try again and if this persists, contact the system admin",
          mode: "error",
        })
      );
    }
  };

  useEffect(() => {
    // setEmail({...email, value: props?.values["email"]})
    console.log(props?.values);
    if (props?.values) {
      setName({ ...name, value: props?.values["name"] });
      setEmail({ ...email, value: props?.values["admin_email"] });
      setContact({ ...contact, value: props?.values["admin_contact"] });
      setFName({ ...fName, value: props?.values["admin_first_name"] });
      setLName({ ...lName, value: props?.values["admin_last_name"] });
    }
  }, [props?.values]);

  return (
    <form onSubmit={onSubmit}>
      <br />
      <Text>Company details</Text>

      <br />
      <br />
      <hr style={{opacity: .1}}/>
      <br />

      <Input
        noBorder
        fullwidth
        placeholder={"Company name"}
        type={"text"}
        setter={setName}
        input={name}
      />
      <br />

      <br />
      <Text>Company Representative</Text>

      <br />
      <br />
      <hr style={{opacity: .1}}/>
      <br />

      <Input
        noBorder
        fullwidth
        placeholder={"email"}
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
        title={props?.values ? "Save changes" : "Add company"}
      />
    </form>
  );
};

export default add_company;

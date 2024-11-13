import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTheme, SERVER_URL, setAlert } from "../model/data";
import { Theme } from "../types";
import Input from "./input";
import Button from "./button";
import { verifyPassword } from "../utils/password_checker";
import { UPDATE } from "../utils/HTTP";

export interface Props {
  setOpen: (open: boolean) => void;
  add?: (data: any) => void;
  values?: any;
  updateProject: any;
}

const add_project = (props: Props) => {
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

  const [loading, setLoading] = useState(false);
  const server = useSelector(SERVER_URL);
  const { id } = useParams();

  useEffect(() => {
    // setEmail({...email, value: props?.values["email"]})
    // console.log(props?.values);
    if (props?.values) {
      setName({ ...name, value: props?.values["name"] });
      setEmail({ ...email, value: props?.values["admin_email"] });
    }
  }, [props?.values]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!props?.values) {
      if (name?.value?.length < 4) {
        dispatch(
          setAlert({
            title: "Invalid name",
            body: "project name must have more than 4 characters",
            mode: "error",
          })
        );
        return;
      }

      setLoading(true);
      const res = await fetch(`${server}/projects/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name?.value,
        }),
      });

      if (res.status == 201) {
        const data = await res.json();
        dispatch(
          setAlert({
            title: "project uploaded successfully",
            body: "project has been created Successfully",
            mode: "success",
          })
        );
        setLoading(false);
        props?.setOpen(false);
        props?.add(data);
      } else {
        dispatch(
          setAlert({
            title: "Failed to upload project",
            body: "Please try again",
            mode: "error",
          })
        );
        setLoading(false);
      }
    } else {
      update();
    }
  };
  // ==============================================================

  const update = async() => {
    if (name?.value == props?.values["name"]) {
      dispatch(
        setAlert({
          title: "Nothing to change",
          body: "No changes detected",
          mode: "normal",
        })
      );
      return;
    }
      if (name?.value?.length < 4) {
        dispatch(
          setAlert({
            title: "Invalid name",
            body: "project name must have more than 4 characters",
            mode: "error",
          })
        );
        return;
      }

    setLoading(true)

    const res = await fetch(`${server}/project/${props?.values["id"]}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name: name?.value
      })
    })

    if (res.status == 202) {
      const data = await res.json();
      dispatch(
        setAlert({
          title: "project updated successfully",
          body: "project has been updated Successfully",
          mode: "success",
        })
      );
      setLoading(false);
      props?.setOpen(false);
      props?.updateProject(data);
    } else {
      dispatch(
        setAlert({
          title: "Failed to update project",
          body: "Please try again",
          mode: "error",
        })
      );
      setLoading(false);
    }

  };

  // ==============================================================

  return (
    <form onSubmit={onSubmit}>
      <Input
        noBorder
        fullwidth
        placeholder={"project name"}
        type={"text"}
        setter={setName}
        input={name}
      />
      <br />
      <Button
        loading={loading}
        fullwidth
        onClick={onSubmit}
        title={props?.values ? "save changes" : "Add project"}
      />
    </form>
  );
};

export default add_project;

import React, { useEffect, useState } from "react";
import Text from "../../components/text";
import { useDispatch, useSelector } from "react-redux";
import { getTheme, SERVER_URL, setAlert, setLoadingState } from "../../model/data";
import { Theme, User } from "../../types";
import { FaCirclePlus, FaEye, FaPen } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import Input from "../../components/input";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../../components/button";
import { Navigate, useNavigate } from "react-router-dom";
import Table from "../../components/table";
import Header from "../../components/header";
import Modal from "../../components/modal"
import AddCompany from "../../components/add_company"
import { DELETE, GET } from "../../utils/HTTP";

export interface Company {
  admin_details: User;
  admin: number;
  id: number;
  name: string;
}

export interface CompanyModalProps {
  open: boolean;
  setOpen: any;
  addCompany: any;
}

const CompanyModal = (props: CompanyModalProps) => {
  const theme: Theme = useSelector(getTheme);

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

  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch(`${server}/company_admins`, {
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
      alert("User has been created Successfully, now uploading company...");
      uploadCompany(data?.id);
    } else {
      alert("Failed to add company admin");
      setLoading(false);
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
      alert("Successfully added company");
      props?.setOpen(false);
      props?.addCompany(data);
      console.log(data);
    } else {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <AnimatePresence mode="sync">
      <motion.div
        layout
        initial={{
          // y: 100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          // y: 100,
          opacity: 0,
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0,0,0,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* modal content  */}
        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: 100,
            opacity: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          style={{
            background: theme?.paper,
            padding: 20,
            width: "30vw",
            // height: "70vh",
            borderRadius: 10,
            boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
          }}
        >
          {/* modalHeader  */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Add a new company</Text>

            {/* close button  */}
            <div
              onClick={() => props?.setOpen(false)}
              style={{
                background: theme?.pale,
                padding: "10px 20px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Text>close</Text>
            </div>
          </div>

          {/* modal body  */}
          <div style={{ marginTop: 10, width: "100%" }}>
            <Input
              noBorder
              fullwidth
              placeholder={"Company name"}
              type={"text"}
              setter={setName}
              input={name}
            />
            <br />
            <Input
              noBorder
              fullwidth
              placeholder={"Company email"}
              type={"email"}
              setter={setEmail}
              input={email}
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
              title={"Add company"}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const companies = () => {
  const theme: Theme = useSelector(getTheme);
  const [CMOpen, setCMOpen] = useState(false);
  const server = useSelector(SERVER_URL);
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<Company[]>([]);
  const dispatch = useDispatch()

  
  
  const addComany = (new_company: Company) => {
    setCompanies([new_company, ...companies]);
  };

  const setter=(id)=>{
    dispatch(setAlert({title: "", body: "", mode: "normal"}))
    DELETE({data: companies, setData: setCompanies, path: "/company/" + id,id: id })
  }
  
  useEffect(() => {
    GET({path: "/companies", setData: setCompanies, setLoading: setLoading})
  }, []);
  
  useEffect(()=>{

    dispatch(setLoadingState(loading))

  },[loading])

  const [currentCompany, setCurrentCompany]=useState({})

  const editCompany=(row: any)=>{

    setCurrentCompany(row)
    setCMOpen(true)

  }

  const updateCompany=(payload: any)=>{
    setCompanies(companies?.map(company => company?.id == payload["id"] ? payload : company))
  }

  const updateCompanyAdmin=(payload: any)=>{

    // look for the company 
    const foundCompany = companies?.find(company=> company?.admin == payload["id"])

    // change all fields starting with admin_ 
    foundCompany.admin_contact = payload["contact"]
    foundCompany.admin_first_name = payload["first_name"]
    foundCompany.admin_last_name = payload["last_name"]
    foundCompany.admin_email = payload["email"]

    // update companies list 
    setCompanies(companies?.map(company => company?.id == payload["id"] ? foundCompany : company))

  }

  useEffect(()=>{

    if(!CMOpen){
      setCurrentCompany(null)
    }

  },[CMOpen])
  
  return (
    JSON.parse(localStorage.getItem("TMS_USER"))?.role != "admin" ? (
      <Navigate to={"/"}/>
    ) :
    <div>
      {/* header  */}
      <Header
        setOpen={setCMOpen}
        title="company"
        count={companies?.length}
        heading="Companies"
      />

      {/* companies list  */}
      {companies?.length == 0 ? (
        <Text is_h1>No results found</Text>
      ) : (
        <Table
          setter={setter}
          columns={["name", "admin_email", "admin_contact"]}
          rows={companies}
          delete
          edit
          view
          redirect_path="/admin/company"
          editor={editCompany}
        />
      )}

      {CMOpen && (
        <Modal open={CMOpen} setOpen={setCMOpen} title={currentCompany ? "Edit company" : "Add company"} content={<AddCompany values={currentCompany && currentCompany} updateCompany={updateCompany} updateAdmin={updateCompanyAdmin} add={addComany} setOpen={setCMOpen}/>}/>
      )}
    </div>
  );
};

export default companies;

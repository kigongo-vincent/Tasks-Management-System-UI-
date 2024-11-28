import React, { useState } from 'react'
import Layout from "../../components/layout"
import { Theme, User } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { getTheme, getUser, SERVER_URL, setAlert } from '../../model/data'
import Input from "../../components/input"
import Button from "../../components/button"
import Text from "../../components/text"
import { verifyPassword } from '../../utils/password_checker'
import { Navigate } from 'react-router-dom'

const change_password = () => {

  const theme:Theme = useSelector(getTheme)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [password, setPassword] = useState({
    value: "",
    error: ""
  })
  const [passwordConfirmation, setPasswordConfirmation] = useState({
    value: "",
    error: ""
  })
  const user:User = useSelector(getUser)
  const server = useSelector(SERVER_URL)

  const onSubmit=async(e)=>{
    e.preventDefault()

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

    if(password?.value != passwordConfirmation?.value){
      dispatch(setAlert({title: "Password mismatch", body: "Please provide matching passwords", mode: "error"}))
      return
    }
    
    if(password?.value?.length < 4){
      dispatch(setAlert({title: "Short password", body: "password must be of atleast 4 characters", mode: "error"}))
      return
    }

    
    setLoading(true)
    const res = await fetch(`${server}/update_user/${user?.user_id}`, {
      method:"PATCH",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        password: password?.value
      })
    })

    if(res.status == 200){
      dispatch(setAlert({title: "Password updated", body: "Your password has been updated successfully", mode: "success"}))
      setLoading(false)
      setPassword({value: "", error: ""})
      setPasswordConfirmation({value: "", error: ""})
    }else{
      dispatch(setAlert({title: "Password failed to be updated", body: "Your password has not been updated, please try again", mode: "error"}))
      setLoading(false)
    }

  }

  return (
    !user?.email
    ?
    <Navigate to={"/"}/>
    :
    <div>
      <Layout center>

      <form 
      onSubmit={onSubmit}
      style={{
        width: innerWidth > 768 ? "30vw": "90vw",
        background: theme?.paper,
        boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
        padding: innerWidth > 768 ? 40: "40px 20px",
        borderRadius: 3
      }}
      >

        <Text center >Change your password</Text>
        <br />
        <br />
        
        <Input fullwidth setter={setPassword} input={password} type={"password"} noBorder placeholder={"new password"}/>
        <Input fullwidth setter={setPasswordConfirmation} input={passwordConfirmation} type={"password"} noBorder placeholder={"password confirmation"}/>
        <br />
        <Button fullwidth title={"Confirm changes"} loading={loading} onClick={onSubmit} />

        </form>  
      
      </Layout>
    </div>
  )
}

export default change_password

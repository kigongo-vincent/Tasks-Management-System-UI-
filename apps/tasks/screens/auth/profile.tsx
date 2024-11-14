import React from 'react'
import Layout from "../../components/layout"
import { Theme, User } from '../../types'
import { useSelector } from 'react-redux'
import { getTheme, getUser } from '../../model/data'
import { FaUser } from 'react-icons/fa'
import Text from "../../components/text"
import { Navigate } from 'react-router-dom'

const profile = () => {

  const theme:Theme = useSelector(getTheme)
  const user:User = useSelector(getUser)

  return (
    !user?.email 
    ?
    <Navigate to={"/"}/>
    :
    <Layout>
       <div
       style={{
        background: theme?.paper,
        boxShadow: "10px 10px 20px rgba(0,0,0,0.05)",
        padding: "20px 10px",
        display: "flex",
        alignItems: "center",
        borderRadius: 10
       }}
       >
       <div
            style={{
              width: 50,
              height: 50,
              position: "relative",
              margin: "0 20px",
              background: theme?.pale,
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaUser color={theme?.placeholder} />

            {/* activity badge  */}
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: "100%",
                background: theme?.success,
                position: "absolute",
                right: "5%",
                bottom: "5%",
              }}
            />
          </div> 

          <Text>{user?.email}</Text>

        </div> 
    </Layout>
  )
}

export default profile

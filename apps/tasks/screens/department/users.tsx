import React, { useEffect, useState } from 'react'
import { FaTasks } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Table from '../../components/table'
import Text from '../../components/text'
import { getTheme, setLoadingState } from '../../model/data'
import { GET } from '../../utils/HTTP'
import Header from "../../components/header"
import Input from "../../components/input"
import { useParams } from 'react-router-dom'
import { Theme } from '../../types'
import {searchItemsByName} from "../../utils/SEARCH"
import { decryptData, encryptData } from '../../utils/security'

const users = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")

  let {id} = useParams()
  id = decryptData(id)
  const theme:Theme = useSelector(getTheme)

  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    dispatch(setLoadingState(loading))
  }, [loading])

  useEffect(()=>{

    if(search){
      setSearchResults(searchItemsByName(users, search))
    }else{
      setSearchResults([])
    }

  },[search])

  useEffect(() => {

    GET({ path: "/task_grouping_by_department/"+ id, setData: setUsers, setLoading: setLoading })

  }, [])


  const seriailzeTasks = () => {
    users?.forEach(user => {
      user.daily = `${user?.daily_tasks?.task_count} (${Math.floor(user?.daily_tasks?.total_duration / 60) +
        ` hour${Math.floor(user?.daily_tasks?.total_duration / 60) == 1 ? "" : "s"} and ` +
        (user?.daily_tasks?.total_duration % 60) +
        " minutes"})`
      user.monthly = `${user?.monthly_tasks?.task_count} (${Math.floor(user?.monthly_tasks?.total_duration / 60) +
        ` hour${Math.floor(user?.monthly_tasks?.total_duration / 60) == 1 ? "" : "s"} and ` +
        (user?.monthly_tasks?.total_duration % 60) +
        " minutes"})`
      user.weekly = `${user?.weekly_tasks?.task_count} (${Math.floor(user?.weekly_tasks?.total_duration / 60) +
        ` hour${Math.floor(user?.weekly_tasks?.total_duration / 60) == 1 ? "" : "s"} and ` +
        (user?.weekly_tasks?.total_duration % 60) +
        " minutes"})`
    })
  }

  // useEffect(()=>{


  // },[])
  seriailzeTasks()


  return (
    <div>
      {/* <Header heading='Consultants' count={users?.length} /> */}

      <div style={{ background: theme?.paper, padding: 15, borderRadius: 2, minWidth: "max-content" , display:"flex", justifyContent:"space-between"}}>

      {/* count  */}
      <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Consultant(s)</Text>
          <div style={{ margin: "0 5px" }} />
          <div
            style={{
              background: theme?.error,
              height: 30,
              width: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "100%",
            }}
          >
            <Text color="white">{users?.length > 99 ? "99+" : users?.length}</Text>
          </div>
        </div>

      {/* search  */}
      <div className="search">
        <Input
          zeroMargin
          noBorder
          fullwidth={innerWidth < 768}
          setter={setSearch}
          input={search}
          type={"search"}
          placeholder={"search for consultants"}
        />
        {/* </div> */}
      </div>
      {/* end search  */}


      </div>

      {
        users?.length == 0 && !loading
          ?
          <>
            <Text is_h1>No consultants found</Text>
            <br />
            <Text>If your sure you have consultants consider refreshing the page or checking your connection</Text>
          </>
          :
          search 
          ?
          searchResults?.length == 0
          ?
          <Text is_h1>No consultants found</Text>
          :
          <Table rows={searchResults} columns={["name", "daily", "weekly", "monthly"]} redirect_path="/employee" view />
          :
          <Table rows={users} columns={["name", "daily", "weekly", "monthly"]} redirect_path="/employee" view />

      }
    </div>
  )
}

export default users
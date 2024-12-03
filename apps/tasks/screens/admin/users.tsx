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

const users = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")

  const {id} = useParams()
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

    GET({ path: "/grouped_tasks/"+ id, setData: setUsers, setLoading: setLoading })

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
      <Header heading='Consultants' count={users?.length} />

      {/* search  */}
      <div
        className="flex-vertical"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          boxShadow: "10px 10px 20px rgba(0,0,0,.05)",
          backgroundColor: theme?.paper,
          borderRadius: 5,
          padding: 15,
        }}
      >
        

        {/* search  */}
        <div className="search">
        <Input
          zeroMargin
          noBorder
          fullwidth={innerWidth < 768}
          setter={setSearch}
          input={search}
          type={"search"}
          placeholder={"search for tasks"}
        />
        </div>
      </div>
      {/* end search  */}

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
          <Table rows={searchResults} columns={["department","name", "daily", "weekly", "monthly"]} redirect_path="/employee" view />
          :
          <Table rows={users} columns={["department","name", "daily", "weekly", "monthly"]} redirect_path="/employee" view />

      }
    </div>
  )
}

export default users

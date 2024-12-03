import React, { useEffect, useState } from 'react'
import { FaTasks } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import Table from '../../components/table'
import Text from '../../components/text'
import { setLoadingState } from '../../model/data'
import { GET } from '../../utils/HTTP'
import Header from "../../components/header"

const users = () => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoadingState(loading))
  }, [loading])

  useEffect(() => {

    GET({ path: "/grouped_tasks", setData: setUsers, setLoading: setLoading })

  }, [])


  const seriailzeTasks = () => {
    users?.forEach(user => {
      user.id = user?.employee_id
      user.name = user?.employee_name
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
      {
        users?.length == 0 && !loading
          ?
          <>
            <Text is_h1>No consultants found</Text>
            <br />
            <Text>If your sure you have consultants consider refreshing the page or checking your connection</Text>
          </>
          :
          <Table rows={users} columns={["department","name", "daily", "weekly", "monthly"]} redirect_path="/employee" view />

      }
    </div>
  )
}

export default users

import React, { useEffect, useState } from 'react'
import { FaBuilding, FaCalendar, FaChartBar, FaTasks, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Table from '../../components/table'
import Text from '../../components/text'
import { getTheme, setLoadingState, setUser } from '../../model/data'
import { GET } from '../../utils/HTTP'
import Header from "../../components/header"
import Input from "../../components/input"
import { useParams } from 'react-router-dom'
import { Theme } from '../../types'
import { searchItemsByName } from "../../utils/SEARCH"
import { decryptData, encryptData } from '../../utils/security'
import Modal from "../../components/modal";
import { FaChartArea, FaEnvelope, FaPhone } from 'react-icons/fa6'
import {sortArray} from "../../utils/sort"
import { PiArrowFatLineRight } from 'react-icons/pi'


const users = () => {
  const [details, setDetails] = useState(null)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")

  let { id } = useParams()
  id = decryptData(id)
  const theme: Theme = useSelector(getTheme)

  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    dispatch(setLoadingState(loading))
  }, [loading])

  useEffect(() => {

    if (search) {
      setSearchResults(searchItemsByName(users, search))
    } else {
      setSearchResults([])
    }

  }, [search])

  useEffect(() => {

    GET({ path: "/grouped_tasks/" + id, setData: setUsers, setLoading: setLoading })

  }, [])

  // useEffect(()=>{
  //   users && setUsers(sortArray(users, "name", "asc"))
  // },[])

  const [currentFilter, setCurrentFilter] = useState("")

  const filterOptions = [
    {
      label: "Name",
      icon: <FaUser/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "name", "asc")) :setUsers(sortArray(users, "name", "asc")); setCurrentFilter("Name")}
    },
    {
      label: "Department",
      icon: <FaBuilding/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "department", "asc")) :setUsers(sortArray(users, "department", "asc")); setCurrentFilter("Department")}

    },
    {
      label: "Performance by Day",
      icon: <FaChartArea/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "daily_tasks.total_duration", "desc")) :setUsers(sortArray(users, "daily_tasks.total_duration", "desc")); setCurrentFilter("Performance by Day")}
    },
    {
      label: "sort by previous month",
      icon: <PiArrowFatLineRight/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "previous_month_tasks.total_duration", "desc")) :setUsers(sortArray(users, "previous_month_tasks.total_duration", "desc")); setCurrentFilter("sort by previous month")}
    },
    {
      label: "Performance by Week",
      icon: <FaChartBar/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "weekly_tasks.total_duration", "desc")) :setUsers(sortArray(users, "weekly_tasks.total_duration", "desc")); setCurrentFilter("Performance by Week")}
    },
    {
      label: "Performance by Month",
      icon: <FaCalendar/>,
      action: ()=>{search ? setSearchResults(sortArray(searchResults, "monthly_tasks.total_duration", "desc")) :setUsers(sortArray(users, "monthly_tasks.total_duration", "desc")); setCurrentFilter("Performance by Month")}
    },
  ]




  const seriailizeTasks = () => {
    users?.forEach(user => {
      user.daily = `${Math.floor(user?.daily_tasks?.total_duration / 60) +
        `HR${Math.floor(user?.daily_tasks?.total_duration / 60) == 1 ? "" : "s"} & ` +
        (user?.daily_tasks?.total_duration % 60) +
        "Mins"}, ${user?.daily_tasks?.task_count}Task${user?.daily_tasks?.task_count != 1 ? "s" : ""}`


      user.monthly = `${Math.floor(user?.monthly_tasks?.total_duration / 60) +
        `HR${Math.floor(user?.monthly_tasks?.total_duration / 60) == 1 ? "" : "s"} & ` +
        (user?.monthly_tasks?.total_duration % 60) +
        "Mins"}, ${user?.monthly_tasks?.task_count}Task${user?.monthly_tasks?.task_count != 1 ? "s": ""}`
        
      user.previous_month = `${Math.floor(user?.previous_month_tasks?.total_duration / 60) +
        `HR${Math.floor(user?.previous_month_tasks?.total_duration / 60) == 1 ? "" : "s"} & ` +
        (user?.previous_month_tasks?.total_duration % 60) +
        "Mins"}, ${user?.previous_month_tasks?.task_count}Task${user?.previous_month_tasks?.task_count != 1 ? "s": ""}`


      user.weekly = `${Math.floor(user?.weekly_tasks?.total_duration / 60) +
        `HR${Math.floor(user?.weekly_tasks?.total_duration / 60) == 1 ? "" : "s"} & ` +
        (user?.weekly_tasks?.total_duration % 60) +
        "Mins"}, ${user?.weekly_tasks?.task_count}Task${user?.weekly_tasks?.task_count != 1 ? "s": ""}`
    })
  }

  // useEffect(()=>{


  // },[])
  seriailizeTasks()

  const INFO = (payload: any) => {
    setDetails(payload)
  }

  return (
    <div>
      {/* <Header heading='Consultants' count={users?.length} /> */}

      <div style={{ background: theme?.paper, padding: 15, borderRadius: 2, minWidth: "max-content", display: "flex", justifyContent: "space-between" }}>

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
              <Table filterOptions={filterOptions} currentFilter={currentFilter} info={INFO} rows={searchResults} columns={["department", "name", "daily", "previous_month", "weekly", "monthly"]} redirect_path="/employee" view />
            :
            <Table filterOptions={filterOptions} currentFilter={currentFilter} rows={users} info={INFO} columns={["department", "name", "daily", "previous_month", "weekly", "monthly"]} redirect_path="/employee" view />

      }

      {/* modal for viewing details about the employee  */}
      {details && (
        <Modal
          open={Boolean(details)}
          setOpen={setDetails}
          content={
            <div>
              <Text
                // color="primary" 
                is_h1
                heading
                justify>
                {details["name"]}
              </Text>
              <br />
              <br />
              {/* <hr style={{opacity: .3}}/> */}
              {/* <br /> */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaEnvelope style={{ marginRight: 10 }} color={theme?.text} />
                <Text justify>{details["email"]}</Text>
              </div>
              <br />
              <hr style={{ opacity: .4 }} />
              <br />
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaPhone style={{ marginRight: 10 }} color={theme?.text} />
                <Text justify>{details["contact"]}</Text>
              </div>
            </div>
          }
          title="User details"
        />
      )}

    </div>
  )
}

export default users

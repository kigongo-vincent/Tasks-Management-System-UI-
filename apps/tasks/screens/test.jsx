import React from 'react'
import {generateTasksInLocalStorage} from "../test/TMS_TASKS"
import {generateTodosInLocalStorage} from "../test/TMS_TODOS"

const test = () => {
  return (
    <div>
      <button onClick={()=>generateTasksInLocalStorage()}>generate tasks</button>
      <button onClick={()=>generateTodosInLocalStorage()}>generate todos</button>
    </div>
  )
}

export default test

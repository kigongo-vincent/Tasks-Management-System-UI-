import React from 'react'

const x_stack = ({children}) => {
  return (
    <div className='login-parent' style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      {children}
    </div>
  )
}

export default x_stack

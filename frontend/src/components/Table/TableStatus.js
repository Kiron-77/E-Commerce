import React from 'react'

const TableStatus = ({status}) => {
  return (
      <div className={`${status === 'active' ? 'success' : 'danger'}`}>
          {
              status === 'active'?'Publish':'Unpublish'
         } 
      
    </div>
  )
}

export default TableStatus

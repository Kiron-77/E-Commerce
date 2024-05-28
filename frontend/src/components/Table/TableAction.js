import React from 'react';
import { AiFillDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

const TableAction = ({ editUrl, id, deleteAction }) => {
  const handleDelete = (e) => {
    e.preventDefault()
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAction(id)

      }
    });
  }
  return (<>
   
    <NavLink to={editUrl}>
      <button className='bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-700 hover:text-white me-1'>
        <MdModeEdit />
      </button>
    </NavLink>
    <NavLink onClick={handleDelete} to={id}>
      <button className='bg-red-300 p-2 rounded-full cursor-pointer hover:bg-red-700 hover:text-white mr-10 me-1'>
        <AiFillDelete />
      </button>
    </NavLink>
  </>)
}

export default TableAction

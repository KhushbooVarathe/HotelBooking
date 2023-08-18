import React from 'react'
import './home.css';
import { Link, useNavigate } from 'react-router-dom';
import Intercepter from '../intercepter/Intercepter';
function SideBarAdmin() {
    const navigate = useNavigate()

    function logoutfun () {
      localStorage.clear()
      navigate('/login')
    }
  return (
    <>
    <Intercepter/>
    <div className="sidenav text-center">
         <Link className='btn btn-light' to='/login' onClick={logoutfun}>Logout</Link>
  <Link to="/profile">Profile</Link>
  <Link to="/newadmin">Create_Admin</Link>
  {/* <Link to="/admin">Admins</Link> */}
  <Link to="/seebooking">See Booking</Link>
  <Link to="/registeredUsers">Users</Link>
  <Link to="/contact">Add Hotels</Link>
</div>
</>
  )
}

export default SideBarAdmin
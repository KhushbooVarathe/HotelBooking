import logo from './logo.svg'
import './App.css'
import Login from './Register/Login'
import UserNavBar from './NavBAr/UserNavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateComponent from './NavBAr/PrivateComponent'
import Profile from './component/Profile'
import Home from './component/Home'
import Rooms from './component/Rooms'

// const tokenProvider = require('axios-token-interceptor');
import YourBooking from './bookings/Yourbooking'
import SignUp from './Register/SignUp'
import YourPayment from './payment/YourPayment'
function App () {
 
  return (
    <div className='App'>
      {/* <Login/> */}
      <BrowserRouter>
        <UserNavBar />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/rooms/:id' element={<Rooms />} />
            <Route path='/yourbooking' element={<YourBooking />} />
            <Route path='/pay' element={<YourPayment/>} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

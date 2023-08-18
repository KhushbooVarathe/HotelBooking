import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbaradmin from './NavBar/Navbaradmin';
import Login from './Register_Login/Login';
import PrivateComponent from './NavBar/PrivateComponent';
import Profile from './Components/Profile';
import SignUp from './Register_Login/SignUp';
import RegisteredUsers from './Components/RegisteredUsers';
import Home from './Components/Home';
import home from '../src/Components/App.jpg'
import SideBarAdmin from './Components/SideBarAdmin';
import AddHotels from './Components/AddHotels';
import AddHot from './Components/AddHot';
import CreateRooms from './Components/CreateRooms';
import ShowRooms from './Components/ShowRooms';
import UpdateRoom from './Components/UpdateRoom';
import Bookings from './bookings/Bookings';
function App() {
  return (
    <div style={{height:'2300px',backgroundImage:`url(${home})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
     <BrowserRouter>
        <Navbaradmin />
        {/* <SideBarAdmin/> */}
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path='/' element={<Home/>} />
            <Route path='/registeredUsers' element={<RegisteredUsers/>} />
            <Route path='/newadmin' element={<SignUp/>} />
            <Route path='/addhot' element={<AddHot/>} />
            <Route path='/updateroom/:id' element={<UpdateRoom/>} />
            <Route path='/contact' element={<AddHotels/>} />
            <Route path='/seebooking' element={<Bookings/>} />
            
            <Route path='/admin' element={<>Admins</>} />


            <Route path='/admins/:id' element={<ShowRooms/>} />
            <Route path='/profile' element={<Profile/>} />
          </Route>
          {/* <Route path='/signup' element={<SignUp/> } /> */}
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;

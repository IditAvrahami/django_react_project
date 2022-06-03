import './Routes.css'
import {
    Route,
    Routes
  } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import UserList from './user/list/UserList';
import React, {useState} from "react";
import RegisterForm from './user/registration/RegisterForm';

function AppRoutes() {
    const [currentPage, setCurrentPage] = useState('');
    const navigate = useNavigate();

    /**
     * @description - navigate to some tab
     * @param {*} url 
     */
    const navigateTo = (url) => {
        setCurrentPage(url);
        navigate('/'+ url)
    }
    
    const NavBar = () => (
        <header className='navbar'>
            <div className='navbar__title navbar__item'>Project</div>
            <div className='navbar__item' className={currentPage === '' ? 'navbar__item active' : 'navbar__item not_active'}  onClick={navigateTo.bind(this, '')}>Registration</div>
            <div className='navbar__item' className={currentPage === 'summary' ? 'navbar__item active' : 'navbar__item not_active'} onClick={navigateTo.bind(this, 'summary')}>List</div>    
        </header>
    );

    return (     
        <div className="App">
            {NavBar()}
            <div className="menu"></div>
            <div className="App-intro">
                <Routes>
                    <Route path="/" element={<UserList/>}/>
                    <Route path="/summary" element={<UserList/>}/> 
                </Routes>
            </div>
      </div>
    );
  }
  
  export default AppRoutes;
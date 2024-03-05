import {React, useState } from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar';
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Errorpage(props) {


  

  //----------------------JSX OBJECT----------------------//


  
  return (

    <div className='componentContainer'>

      <Navbar/>

       {/*Holds all elements in the main page*/}
       <div className="loginPageContainer">

            {/*main div that hold all the login promps and buttons*/}
            <div className="loginContainer">
                {/* logo*/}
                <img src={logo} className="logoImg" alt="Site logo - a silhouette of a globe"/>

                {/*Error Code*/}
                <div className='inputContainer'>
                  <label for="email">{forgotPassword ? "Confirm email" : "Email"}</label>
                  <input
                    type="text"
                    placeholder="email"
                    name="email"
                  />      
                </div>
                {/*Error Message*/}      
                {!forgotPassword && <div className='inputContainer'>

                  <label for="Password">Password</label>
                  <input
                    type="text"
                    placeholder="password"
                    name="password"
                  />
                  {(!forgotPassword && !sigingUp) && <button onClick={onClickForgot} className='forgotPassword'>Forgot password</button> }
                </div>} 
               
            </div>
      
            {/*background*/}
            <Background isMain={false}/>
       
        </div>
        
     </div>


  );
}

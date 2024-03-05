import {React, useState } from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail  } from "firebase/auth";
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Loginpage() {



  //---------------------------STATE--------------------------------//

  //set whether the user is currently requesting a new password
  const [forgotPassword, setForgotPassword] = useState(false)

  //set whether the user is currently signing up
  const [sigingUp, setSigingUp] = useState(false)


  //--------------------------FUNCTIONS----------------------------//

  //used for redirecting to pages
  const navigate = useNavigate();


  //changes state when user clicks reset password
  function onClickForgot(){setSigingUp(false); setForgotPassword(true); }


  //changes state when user clicks signup
  function  onClickSignup(){setSigingUp(true); setForgotPassword(false); }


  //registers new user
  function onClickRegister(){
    
    const auth = getAuth();


    //get inputs from fields

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        //set loggedIn local storage value to true and go to main page


        navigate("/");


      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
       
        //go to error page

      });
  }



  function login(){

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  }




  function onClickResetPassword(){

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });


  }



  

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

                {/*Email prompt*/}
                <div className='inputContainer'>
                  <label for="email">{forgotPassword ? "Confirm email" : "Email"}</label>
                  <input
                    type="text"
                    placeholder="email"
                    name="email"
                  />      
                </div>
                {/*Password prompt*/}      
                {!forgotPassword && <div className='inputContainer'>

                  <label for="Password">Password</label>
                  <input
                    type="text"
                    placeholder="password"
                    name="password"
                  />
                  {(!forgotPassword && !sigingUp) && <button onClick={onClickForgot} className='forgotPassword'>Forgot password</button> }
                </div>} 
                {/* Confirm Password prompt*/}      
                {(sigingUp && !forgotPassword) && <div className='inputContainer'>

                  <label for="Password">Confirm Password</label>
                  <input
                    type="text"
                    placeholder="password"
                    name="password"
                  />
                </div>} 
                {/*login and forgot password buttons*/}   
                <button className='navButton'>{(forgotPassword && !sigingUp) ? "Reset Password" : (sigingUp ? "Create account" : "Login")}</button>
                {(!forgotPassword && !sigingUp) && <p className='noPassText'>No account? <button onClick={onClickSignup}>Sign up here</button></p>}

            </div>
      
            {/*background*/}
            <Background isMain={false}/>
       
        </div>
        
     </div>


  );
}

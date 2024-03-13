import {React} from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar'; //navbar
//Firebase
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../firebase"
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function ForgotPassword(props) {

//--------------------------FUNCTIONS----------------------------//

  //resets password, if it fails displays error message as alert
  function onClickResetPassword(){

    //get email from input
    let email = document.getElementById("email").value;

    sendPasswordResetEmail(auth, email)
      .then(() => { window.alert("Password reset email sent!");})
      .catch((error) => {
         //display error alert
         window.alert("Error: " + error.message + "\nCode: " + error.code);
        // ..
      });

  }



  //----------------------JSX OBJECT----------------------//


  
  return (

    //holds entire page
    <div className='componentContainer'>

      {/*navbar, wrapped in a div in order to hide it*/}
      <div className='loginNav'><Navbar page={5}/></div>

       {/*Holds all elements in the main page*/}
       <div className="loginPageContainer">

            {/*main div that hold all the login promps and buttons*/}
            <div className="loginContainer">
                {/* logo*/}
                <img src={logo} className="logoImg" alt="Site logo - a silhouette of a globe"/>

                {/*Email prompt*/}
                <div className='inputContainer'>
                  <label for="email">Confirm email</label>
                  <input
                    type="text"
                    placeholder="email"
                    name="email"
                    id="email"
                  />      
                </div>
              
                {/*login and forgot password buttons*/}   
                <button onClick={onClickResetPassword} className='navButton loginButton'>Reset Password</button>

            </div>
      
            {/*background*/}
            <Background isMain={false}/>
       
        </div>
        
     </div>


  );
}

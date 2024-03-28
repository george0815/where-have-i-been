import {React} from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar'; //navbar
import { useNavigate } from "react-router-dom"; //navigate, used to go to homepage
//firebase
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase"
//CSS
import '../styles/Mainpage.css';
import '../styles/fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Signup(props) {


  //--------------------------FUNCTIONS----------------------------//

  //used for redirecting to pages
  const navigate = useNavigate();


  //registers new user, displays any errors as an alert
  function onClickRegister(){
    

    //get inputs from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("passwordConfirm").value;

    //if both inputted passwords match, attempt to sign up user
    if(passwordConfirm === password){
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          
          //set loggedIn local storage value to true and go to main page
          localStorage.setItem('user', JSON.stringify(user));
          props.setLoggedIn(true);

          //go to homepage 
          navigate("/");

        })
        .catch((error) => {
          //display error alert
          window.alert("Error: " + error.message + "\nCode: " + error.code);

        });
    }
    else{
      window.alert("Error: passwords do not match");
    }


  }




  

  //----------------------JSX OBJECT----------------------//


  
  return (

    //holds entire page
    <div className='componentContainer'>

      {/*navbar*/}
      <div className='loginNav'><Navbar page={5}/></div>

       {/*Holds all elements in the main page*/}
       <div className="loginPageContainer">

            {/*main div that hold all the login promps and buttons*/}
            <div className="loginContainer">
                {/* logo*/}
                <img src={logo} className="logoImg" alt="Site logo - a silhouette of a globe"/>

                {/*Email prompt*/}
                <div className='inputContainer'>
                  <label for="email">Email</label>
                  <input
                    type="text"
                    placeholder="email"
                    name="email"
                    id="email"
                  />      
                </div>
                {/*Password prompt*/}      
                <div className='inputContainer'>

                  <label for="Password">Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    id="password"
                  />
                </div>
                {/* Confirm Password prompt*/}      
                <div className='inputContainer'>

                  <label for="PasswordConfirm">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="confirm password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                  />
                </div>
                {/*login and forgot password buttons*/}   
                <button onClick={ onClickRegister} className='navButton loginButton'>Create account</button>

            </div>
      
            {/*background*/}
            <Background isMain={false}/>
       
        </div>
        
     </div>


  );
}

import {React} from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase"
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Signup(props) {




  //--------------------------FUNCTIONS----------------------------//

  //used for redirecting to pages
  const navigate = useNavigate();


  //registers new user
  function onClickRegister(){
    

    //get inputs from fields
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordConfirm = document.getElementById("passwordConfirm").value;


    if(passwordConfirm === password){
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          
          //set loggedIn local storage value to true and go to main page
          localStorage.setItem('user', JSON.stringify(user));

          props.setLoggedIn(true);

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

    <div className='componentContainer'>

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
                    type="text"
                    placeholder="password"
                    name="password"
                    id="password"
                  />
                </div>
                {/* Confirm Password prompt*/}      
                <div className='inputContainer'>

                  <label for="PasswordConfirm">Confirm Password</label>
                  <input
                    type="text"
                    placeholder="passwordConfirm"
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

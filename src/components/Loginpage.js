import {React} from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
import Navbar from './Navbar'; //navbar
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'; //gets link from react router
//firebase
import { signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase"
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Loginpage(props) {

  //--------------------------FUNCTIONS----------------------------//

  //used for redirecting to pages
  const navigate = useNavigate();


  //logs in user, displays any errors via alert
  function onClickLogin(){

     //get inputs from fields
     let email = document.getElementById("email").value;
     let password = document.getElementById("password").value;


    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        //set loggedIn local storage value to true and go to main page
        const user = userCredential.user;
        localStorage.setItem('loggedIn', true);
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
                    type="password"
                    placeholder="password"
                    name="password"
                    id="password"
                  />
                <Link className='forgotPassword' to="../Forgotpassword"><button className='forgotPassword'>Forgot password</button></Link>
                </div>
              
                {/*login and forgot password buttons*/}   
                <button onClick={onClickLogin} className='navButton loginButton'>Login</button>
                 <p className='noPassText'>No account? <Link className='noPassText' to="../Signup"><button>Sign up here</button></Link></p>

            </div>
      
            {/*background*/}
            <Background isMain={false}/>
       
        </div>
        
     </div>


  );
}

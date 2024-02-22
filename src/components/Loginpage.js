import {React } from 'react'; //React
import Background from './Background'; //Gets background
import logo from '../images/logo.svg'; //gets globe logo
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Loginpage.css';
import '../styles/Navbar.css';



//login page
export default function Loginpage() {

  
  return (

       //Holds all elements in the main page
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
              />      
            </div>
            {/*Password prompt*/}      
            <div className='inputContainer'>

              <label for="Password">Password</label>
              <input
                type="text"
                placeholder="password"
                name="password"
              />
            </div>      
            {/*login and forgot password buttons*/}   
            <button className='navButton'>Login</button>
            <p className='noPassText'>No account? <button>Sign up here</button></p>

        </div>
       
       
       {/*background*/}
       <Background isMain={false}/>
  

       
     </div>

  );
}

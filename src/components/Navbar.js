import { useState, useRef, useEffect, React } from 'react'; //React
import logo from '../images/logo.svg'; //gets globe logo
import {countries} from "countries-list"; //gets list of every country (used for title)
//CSS
import '../styles/Navbar.css';
import '../styles/Fonts.css';





//navbar, used in every page except the login page
export default function Navbar() {


  //used for cycling through countries for the title text
  let titleTextInterval = useRef();

  //initiates title
  const [country, setCurrentCountry] = useState("Where have I been?") // set currrent slide index


  //sets the title to a random countries name every 100ms up to i times
  function showCountries(i) {
    let keys = Object.keys(countries);

    setTimeout(function () {
      //only get countries whos names are less that 18 characters
      let moreThan18Char = true;
      while(moreThan18Char){
        let randomNum = Math.floor(keys.length * Math.random())
        if(countries[keys[randomNum]].name.length < 18){
          moreThan18Char = false;
          setCurrentCountry(countries[keys[randomNum]].name);
        }
      }

      //set the title back to normal
        if(i == 20){setCurrentCountry("Where have I been?"); 
      }
    }, i * 100);
}

useEffect(() => {

    //every 15 seconds set the title to a series of random countrys' names
    titleTextInterval = setInterval(() => {for(let i = 0; i <= 20; i++){ showCountries(i);}}, 15000);
    return () => {  clearInterval(titleTextInterval)}

})

  //Just for testing purposes, will be replaced with proper variables from props later
  const [page, setPage] = useState(0);
  const [loggedIn, setloggedIn] = useState(false);

  /**
   * 0 = Main page
   * 1 = Album
   * 2 = Albums
   * 3 = individual photo
   * 4 = login page
   */



  return (
    //whole navbar
    <nav className='mainNav'>
      {/* title*/}
      <div className="logo">{country}</div>
      {/* logo*/}
      <img src={logo} alt="Site logo - a silhouette of a globe"/>

      {/*Holds all buttons */}
      <div className="navButtonContainer">
       {page == 0 && <button className="navButton">New album</button>}
        {page == 1 && <button className="navButton">Add photo</button>}
        {(page == 1 || page == 3) && <button className="navButton">Edit</button>}
        {(page == 1 || page == 2) && <button className="navButton">Sort</button>}
        {(page == 1 || page == 3) && <button className="navButton">Download</button>}
        <button className="navButton">Language</button>
        {!loggedIn && <button className="navButton">Login</button>}
      </div>

    </nav>
  );
}


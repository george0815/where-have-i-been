import { useState, useEffect, React } from 'react'; //React
import logo from '../images/logo.svg'; //gets globe logo
import {countries} from "countries-list"; //gets list of every country (used for title)
//CSS
import '../styles/Navbar.css';
import '../styles/Fonts.css';


//navbar, used in every page except the login page
export default function Navbar(props) {


  //handles sorting
  function onClickSort(evt) {

    //take parameter

    //get current album from prop

    switch(evt.target.value) {
      case "date":
          setShowTagInput(false)
        break;
      case "caption":
          setShowTagInput(false)
        break;
      case "description":
          setShowTagInput(false)
        break;
      case "location":
          setShowTagInput(false)
        break;
      case "tags":
          setShowTagInput(true)
          break;
      default:
          setShowTagInput(false)
      }

    
    evt.target.value = "Sort by..."
  }


  //onchange for tag input, sorts photo/album by tag
  function onTagInputChange(e){
    
  
  }


  //used for showing search tags input
  const [showTagInput, setShowTagInput] = useState(false)


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
        if(i === 20){setCurrentCountry("Where have I been?"); 
      }
    }, i * 100);
  }


  //every 15 seconds set the title to a series of random countrys' names
  useEffect(() => {
    let titleTextInterval = setInterval(() => {for(let i = 0; i <= 20; i++){ showCountries(i);}}, 15000);
    return () => {  clearInterval(titleTextInterval)}
  })


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
        {props.page === 2 && <button className="navButton">New album</button>}
        {props.page === 1 && <button className="navButton">Add photo</button>}
        {(props.page === 1 || props.page === 3) && <button onClick={props.onClickEdit} className="navButton">Edit</button>}
        {(props.page === 1 || props.page === 2) && <select className="navButton sort" onChange={(e) => {onClickSort(e)}}>
          <option defaultValue="Sort by...">Sort by...</option>
          <option>date</option>
          <hr/>
          <option>caption</option>
          <hr/>
          <option>description</option> 
          <hr/>
          <option>location</option>
          <hr/>
          <option>tags</option>
        </select>}
        {showTagInput && <input onChange={(e) => {onTagInputChange(e)}} placeholder='Enter tag'/>}
        {(props.page === 1 || props.page === 3) && <button className="navButton">Download</button>}
        <button className="navButton">Language</button>
        {!props.loggedIn && <button className="navButton">Login</button>}
      </div>

    </nav>
  );
}


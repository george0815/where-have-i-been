import { useState, useEffect, React } from 'react'; //React
import logo from '../images/logo.svg'; //gets globe logo
import {countries} from "countries-list"; //gets list of every country (used for title)
//CSS
import '../styles/Navbar.css';
import '../styles/Fonts.css';


//navbar, used in every page except the login page
export default function Navbar(props) {


  //handles removing
  function remove(){

     //make new temp album object from localstorage albums object
     let tempAlbums = JSON.parse(localStorage.getItem("albums"));

     let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});

     if(props.page === 2){
      tempAlbums.splice(tempAlbums.findIndex(index, 1)); // 2nd parameter means remove one item only
     }
     else if(props.page === 1){
    //  tempAlbums[index].photos.splice(tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id}));
     }


  }


  //handles sorting
  function onClickSort(evt) {

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));


    //sorts albums if user is on albums page
    if(props.page === 2){
      if(evt.target.value !== "tag") {
        setShowTagInput(false)
        tempAlbums = tempAlbums.sort(stringSort(evt.target.value));
      }     
      else{setShowTagInput(true)}


      //saves to local storage and refreshes albums
      localStorage.setItem('albums', JSON.stringify(tempAlbums));
      props.updateAlbums(); 
    }


    //sorts photos if user is on a page or an individual album
    else if(props.page === 1){

      let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});

      //sort the photo array for that album and update temp albums
      if(evt.target.value !== "tag") {
        setShowTagInput(false)
        tempAlbums[index].photos = tempAlbums[index].photos.sort(stringSort(evt.target.value));
        console.log(tempAlbums);
      }
      else{setShowTagInput(true)}

      //set currentAlbum in session storage
      sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

      //call function to reset pictures page
      props.updatePictures();


    }
         

    //reset the select value to always show sort
    evt.target.value = "Sort by..."


    

  }




  //function used to sort by descripton, name and location
  function stringSort(prop) {

    return function (a, b){
      const stringA = a[prop].toUpperCase(); // ignore upper and lowercase
      const stringB = b[prop].toUpperCase(); // ignore upper and lowercase
        
      //sort in an ascending order
      if (stringA < stringB) {return -1;}
      if (stringA > stringB) {return 1;}
    
      // names must be equal
      return 0;
    }
  }


  //onchange for tag input, sorts photo/album by tag
  function onTagInputChange(e){props.setSearchTag(e.target.value); }


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
        {(props.page === 1 || props.page === 3) && <button  onClick={remove} className="navButton">Remove</button>}
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
          <option>tag</option>
        </select>}
        {showTagInput && <input onChange={(e) => {onTagInputChange(e)}} placeholder='Enter tag'/>}
        {(props.page === 1 || props.page === 3) && <button className="navButton">Download</button>}
        <button className="navButton">Language</button>
        {!props.loggedIn && <button className="navButton">Login</button>}
      </div>

    </nav>
  );
}


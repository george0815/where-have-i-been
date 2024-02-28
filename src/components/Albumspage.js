import {React, useState, useEffect } from 'react'; //React
import Background from './Background'; //Gets background
import {Link} from 'react-router-dom'; //gets link from react router
import Navbar from './Navbar';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Albumspage.css';




//Alubums page
export default function Albumspage(props) {


  //handles album button functionality,
  //onclick pass clicked album into session storage
  function onclickAlbum(index){
    //sets clicked album
    sessionStorage.setItem("currentAlbum", JSON.stringify(albumsObj[index]));
  }


  //sets up albums state
  const [albumsObj, setAlbumsObj] = useState(JSON.parse(localStorage.getItem("albums"))); 


  //used to update ablums after sorting, gets passed to navbar
  function updateAlbums(){

    let temp = albumsObj;
    temp = JSON.parse(localStorage.getItem("albums"));
    console.log(temp);
    setAlbumsObj(temp);
    console.log(albumsObj);

  }


  //search tag, tag the user wants to filter by
  const [searchTag, setSearchTag] = useState("")

  //sets search tag
  //function setSearchTag(tag){ setSearchTag(tag) }



  return (

    <div className='componentContainer transparentBackground'>

      <Navbar   function setSearchTag={setSearchTag} updateAlbums={updateAlbums} page={2} />

       {/*Holds all elements in the main page*/}
       <div className="albumPageContainer">

        {/*main div that hold all the login promps and buttons*/}
          <div className="albumContainer">

              {/* albums
              creates each album button from data, it pulls data from a database if the user is signed in
              or localstorage if the user doens't have an account  */} 
              {albumsObj.map((album, index) => (

                //redirects to album
                (album.tags.some(tg => tg.includes(searchTag)) && searchTag != "" || (searchTag === "")) && <Link to="album" key={index} onClick={() => { onclickAlbum(index)}}>
                  <button
                    key={album.name}
                    className="albumButton"
                    src={album.img}         
                  > 
                  {/*Contains all the text that shows when the user hovers over the album button*/}
                    <div className='tooltiptext'>
                      <br/>
                      <p>{album.name}</p>
                      <p>{album.location} - {album.dateFrom} to {album.dateTo}</p>
                      <br/>        
                      <p>{album.description}</p>
                      <br/>     
                      <nav className='tagContainer'>
                      {album.tags.map((tag) => (<div className='tag'> {tag}</div>))}
                      </nav>
                    </div>
                    <img src={album.img} alt={album.description}/> 
                  </button>
                </Link>

                ))}
          
          </div>
              
        {/*background*/}
        <Background isMain={false}/>
    
      </div>
    </div>

  );
}

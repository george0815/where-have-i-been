import {React, useState, useEffect } from 'react'; //React
import Background from './Background'; //Gets background
import {Link} from 'react-router-dom'; //gets link from react router
import Navbar from './Navbar';
import Editing from './Editing';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Albumspage.css';




//Alubums page
export default function Albumspage() {


  //---------------------------STATE--------------------------------//

  //search tag, tag the user wants to filter by
  const [searchTag, setSearchTag] = useState("")

  //sets up albums state
  const [albumsObj, setAlbumsObj] = useState(JSON.parse(localStorage.getItem("albums"))); 

  //sets up state for //sets up state for editing props
  const [editingSettings, setEditingSettings] = useState(

    {
        adding: true,
        isAlbum: true,
        saveButtonText: "Create",
        currentlyEditing: false
    }

  ); 

  //--------------------------FUNCTIONS-----------------------------//


  //used to update ablums after sorting, gets passed to navbar
  function updateAlbums(){
    let temp = albumsObj;
    temp = JSON.parse(localStorage.getItem("albums"));
    setAlbumsObj(temp);
  }

  //displays editing component
  function onClickAdd(){ setEditingSettings(
    
    {
        adding: true,
        isAlbum: true,
        saveButtonText: "Add",
        currentlyEditing: true
    }

  );}

  //hides editing component and refreshes state
  function onEditExit(){ 
    
    setEditingSettings(
      {
        adding: true,
        isAlbum: true,
        saveButtonText: "Create",
        currentlyEditing: false
      }    
    )

    updateAlbums();
  ;}


  //empty album object for adding
  let currentAlbum = {
    description: "",
    location: "",
    toDate: "",
    fromDate: "",
    caption: "",
    id: "",
    tags: []
  }


  //handles album button functionality, onclick pass clicked album into session storage
  function onclickAlbum(index){  sessionStorage.setItem("currentAlbum", JSON.stringify(albumsObj[index])); }


  //------------------------JSX OBJECT------------------------------//

  return (

    <div className='componentContainer transparentBackground'>

      <Navbar setSearchTag={setSearchTag} onClickAdd={onClickAdd} updateAlbums={updateAlbums} page={2} />

       {/*Holds all elements in the main page*/}
       <div className="albumPageContainer">

        {/*Contains fullscreen version of photo*/}
        <div className={editingSettings.currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
            <Editing editingSettings={editingSettings} onEditExit={onEditExit} currentAlbum={currentAlbum}/>
        </div>

        {/*main div that hold all the login promps and buttons*/}
          <div className="albumContainer">

              {/* albums
              creates each album button from data, it pulls data from a database if the user is signed in
              or localstorage if the user doens't have an account  */} 
              {albumsObj.map((album, index) => (

                //redirects to album
                (album.tags.some(tg => tg.includes(searchTag)) && searchTag != "" || (searchTag === "")) && <Link to="album" key={index} onClick={() => { onclickAlbum(index)}}>
                  <button
                    key={album.caption}
                    className="albumButton"
                    src={album.img}           
                  > 
                  {/*Contains all the text that shows when the user hovers over the album button*/}
                    <div className='tooltiptext'>
                      <br/>
                      <p>{album.caption}</p>
                      <p>{album.location} - {album.date} to {album.dateTo}</p>
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

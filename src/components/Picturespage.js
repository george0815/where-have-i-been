import {React, useState, useEffect} from 'react'; //React
import Background from './Background'; //Gets background
import {Link} from 'react-router-dom'; //gets link from react router
import Navbar from './Navbar'; //navbar
import Editing from './Editing'; //editing component
//CSS
import '../styles/fonts.css';
import '../styles/Navbar.css';
import '../styles/Picturespage.css';
//for scaling text
var flowtype = require('flowtype')



//login page
export default function Picturespage(props) {

  //---------------------------STATE--------------------------------//


  //sets up current album state
  const [currentAlbum, setCurrentAlbum] = useState(JSON.parse(sessionStorage.getItem("currentAlbum"))); 

  //search tag, tag the user wants to filter by
  const [searchTagPictures, setSearchTagPictures] = useState("")


  //sets up state for editing props
  const [editingSettings, setEditingSettings] = useState(

    {
        adding: false,
        isAlbum: true,
        saveButtonText: "Save",
        currentlyEditing: false
    }
  )

  //create empty current photo
  let currentPhoto = {
    description: "",
    location: "",
    date: "",
    caption: "",
    id: "",
    tags: []
  }
  //--------------------------FUNCTIONS-----------------------------//

  //handles photo button functionality, onclick pass clicked photo into session storage
  function onclickPhoto(index){sessionStorage.setItem("currentPhoto", JSON.stringify(currentAlbum.photos[index]));}

  //displays editing component
  function onClickEdit(){ setEditingSettings(
    
    {
        adding: false,
        isAlbum: true,
        saveButtonText: "Save",
        currentlyEditing: true
    }

  );}


  //displays editing component
  function onClickAdd(){ setEditingSettings(
    
    {
        adding: true,
        isAlbum: false,
        saveButtonText: "Add",
        currentlyEditing: true
    }

  );}

  //hides editing component and refreshes state
  function onEditExit(){ 

    setEditingSettings(
      {
          adding: false,
          isAlbum: true,
          saveButtonText: "Save",
          currentlyEditing: false
      }
    )
    //refeshes  page
    updatePictures();
   
    ;}



  //used to update pictures after sorting, gets passed to navbar
  function updatePictures(){
    let temp = currentAlbum;
    temp = JSON.parse(sessionStorage.getItem("currentAlbum")); 
    setCurrentAlbum(temp);
  }



  //------------------------USEEFFECT------------------------------//


  useEffect(() => {
    //automatically resizes text
    Array.from(document.getElementsByClassName('toolTipCaption')).forEach((caption)=>{

      flowtype(caption, {
        maxWidth: '1000px', // can be a CSS value or a Number
        minWidth: '200px',
        lineRatio: 1.45,
        min: 12.5,
        max: 60
      })

    })
    Array.from(document.getElementsByClassName('tagDescription')).forEach((caption)=>{

      flowtype(caption, {
        maxWidth: '1000px', // can be a CSS value or a Number
        minWidth: '200px',
        lineRatio: 1.45,
        min: 12.5,
        max: 60
      })

    })
    
  });
  
  
  //------------------------JSX OBJECT------------------------------//
  

  return (
    
    //holds entire page
    <div className='componentContainer transparentBackground'>

      {/*navbar*/}
      <Navbar page={1} setAlbums={props.setAlbums} setLoggedIn={props.setLoggedIn}  loggedIn={props.loggedIn} setSearchTag={setSearchTagPictures} updatePictures={updatePictures} onClickEdit={onClickEdit} onClickAdd={onClickAdd}/>

      {/*Holds all elements in the main page*/}
      <div className={editingSettings.currentlyEditing ? 'picturePageContainer picturePageContainerEditing' : 'picturePageContainer'}>

            {/*Contains fullscreen version of photo*/}
            <div className={editingSettings.currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
                  <Editing  loggedIn={props.loggedIn} editingSettings={editingSettings} onEditExit={onEditExit} currentPhoto={currentPhoto} currentAlbum={currentAlbum}/>
            </div>

            {/*main div that hold all the login promps and buttons*/}
            <div className="pictureContainer">

                {/*creates each picture button from data, it pulls data from a database if the user is signed in
                or localstorage if the user doens't have an account    */}
                {currentAlbum.photos.map((photo, index) => (
    
                  (((photo.tags.some(tg => tg.includes(searchTagPictures)) || photo.caption.includes(searchTagPictures) || photo.location.includes(searchTagPictures) || photo.description.includes(searchTagPictures))
                  && (searchTagPictures !== "")) || (searchTagPictures === "")) && <Link to="../photo" key={photo.caption}onClick={() => {onclickPhoto(index)}}>
                    <button
                      id={index}
                      
                      className="pictureButton"
                    > 
                      {/*Contains all the text that shows when the user hovers over the photo button*/}
                      <div className='tooltiptextpic'>
                        <div className='toolTipCaption'>{photo.caption}<br/> <br/>{photo.location} - {photo.date}</div> 
                        <p className='tagDescription'>{photo.description}</p>
                      </div>
                      {/*actual photo*/}
                      <img alt={photo.caption} src={photo.img}/> 

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

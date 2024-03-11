import {React, useState, useEffect} from 'react'; //React
import Background from './Background'; //Gets background
import {Link} from 'react-router-dom'; //gets link from react router
import Navbar from './Navbar';
import Editing from './Editing';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Picturespage.css';




//login page
export default function Picturespage(props) {

  //---------------------------STATE--------------------------------//


  //sets up current album state
  const [currentAlbum, setCurrentAlbum] = useState(JSON.parse(sessionStorage.getItem("currentAlbum"))); 

  //search tag, tag the user wants to filter by
  const [searchTagPictures, setSearchTagPictures] = useState("")

  console.log(currentAlbum);

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

    updatePictures();
   
    ;}



  //used to update pictures after sorting, gets passed to navbar
  function updatePictures(){
    let temp = currentAlbum;
    temp = JSON.parse(sessionStorage.getItem("currentAlbum")); 
    setCurrentAlbum(temp);
  }

  

  //------------------------JSX OBJECT------------------------------//
  

  return (

    <div className='componentContainer transparentBackground'>

      <Navbar page={1} setLoggedIn={props.setLoggedIn}  loggedIn={props.loggedIn} setSearchTag={setSearchTagPictures} updatePictures={updatePictures} onClickEdit={onClickEdit} onClickAdd={onClickAdd}/>

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


    
                  ((photo.tags.some(tg => tg.includes(searchTagPictures)) || photo.caption.includes(searchTagPictures) || photo.location.includes(searchTagPictures) || photo.description.includes(searchTagPictures))
                  && searchTagPictures !== "" || (searchTagPictures === "")) && <Link to="../photo" key={photo.caption}onClick={() => {onclickPhoto(index)}}>
                    <button
                      id={index}
                      
                      className="pictureButton"
                    > 
                      {/*Contains all the text that shows when the user hovers over the photo button*/}
                      <div className='tooltiptextpic'>
                        <p className='toolTipCaption'>{photo.caption}<br/> <br/>{photo.location} - {photo.date}</p> 
                        <p className='tagDescription'>{photo.description}</p>
                      </div>
                      {/*actual photo*/}
                      <img src={photo.img}/> 

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

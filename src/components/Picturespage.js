import {React, useState} from 'react'; //React
import Background from './Background'; //Gets background
import {Link} from 'react-router-dom'; //gets link from react router
import Navbar from './Navbar';
import Editing from './Editing';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Picturespage.css';




//login page
export default function Picturespage() {

  //sets up current album state
  const [currentAlbum, setCurrentAlbum] = useState(JSON.parse(sessionStorage.getItem("currentAlbum"))); 

  //handles photo button functionality,
  //onclick pass clicked photo into session storage
  function onclickPhoto(index){
    //sets clicked album
    sessionStorage.setItem("currentPhoto", JSON.stringify(currentAlbum.photos[index]));
  }


  //displays editing component
  function onClickEdit(){
    setcurrentlyEditing(true);
  }

  //hides editing component and refreshes state
  function onEditExit(){
    setcurrentlyEditing(false);
  }


  //sets up state for whether the user is currently editing
  const [currentlyEditing, setcurrentlyEditing] = useState(false); 



  


  //creates each picture button from data, it pulls data from a database if the user is signed in
  //or localstorage if the user doens't have an account     
  const photoThumbnails = currentAlbum.photos.map((photo, index) => (
    
    <Link to="../photo" key={photo.name}onClick={() => {onclickPhoto(index)}}>
      <button
        id={index}
        
        className="pictureButton"
      > 
        {/*Contains all the text that shows when the user hovers over the photo button*/}
        <div className='tooltiptextpic'>
          <br/>
          <p>{photo.name}</p>
          <br/>        
          <p>{photo.date}</p>
          <br/>        
          <p>{photo.description}</p>
        </div>
        {/*actual photo*/}
        <img src={photo.img}/> 

      </button>
    </Link>
  ))
  

  return (

    <div className='componentContainer transparentBackground'>

      <Navbar page={1} onClickEdit={onClickEdit}/>

      {/*Holds all elements in the main page*/}
      <div className="picturePageContainer">

            {/*Contains fullscreen version of photo*/}
            <div className={currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
                  <Editing saveButtonText="Save" isAlbum={true} adding={false} onEditExit={onEditExit} currentAlbum={currentAlbum}/>
            </div>

            {/*main div that hold all the login promps and buttons*/}
            <div className="pictureContainer">

                {/* albums*/}
                {photoThumbnails}
            
            </div>
       
            {/*background*/}
            <Background isMain={false}/>

      </div>

    </div>


  );
}

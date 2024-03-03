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

    //---------------------------STATE--------------------------------//


  //sets up current album state
  const [currentAlbum, setCurrentAlbum] = useState(JSON.parse(sessionStorage.getItem("currentAlbum"))); 

  //search tag, tag the user wants to filter by
  const [searchTagPictures, setSearchTagPictures] = useState("")

  //sets up state for whether the user is currently editing
  const [currentlyEditing, setcurrentlyEditing] = useState(false); 

  //--------------------------FUNCTIONS-----------------------------//

  //handles photo button functionality, onclick pass clicked photo into session storage
  function onclickPhoto(index){sessionStorage.setItem("currentPhoto", JSON.stringify(currentAlbum.photos[index]));}

  //displays editing component
  function onClickEdit(){ setcurrentlyEditing(true);}

  //hides editing component and refreshes state
  function onEditExit(){ setcurrentlyEditing(false);}

  //used to update pictures after sorting, gets passed to navbar
  function updatePictures(){
    let temp = currentAlbum;
    temp = JSON.parse(sessionStorage.getItem("currentAlbum")); 
    setCurrentAlbum(temp);
  }


  //------------------------JSX OBJECT------------------------------//
  

  return (

    <div className='componentContainer transparentBackground'>

      <Navbar page={1} setSearchTag={setSearchTagPictures} updatePictures={updatePictures} onClickEdit={onClickEdit}/>

      {/*Holds all elements in the main page*/}
      <div className="picturePageContainer">

            {/*Contains fullscreen version of photo*/}
            <div className={currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
                  <Editing saveButtonText="Save" isAlbum={true} adding={false} onEditExit={onEditExit} currentAlbum={currentAlbum}/>
            </div>

            {/*main div that hold all the login promps and buttons*/}
            <div className="pictureContainer">

                {/*creates each picture button from data, it pulls data from a database if the user is signed in
                or localstorage if the user doens't have an account    */}
                {currentAlbum.photos.map((photo, index) => (
    
                  (photo.tags.some(tg => tg.includes(searchTagPictures)) && searchTagPictures != "" || (searchTagPictures === "")) && <Link to="../photo" key={photo.caption}onClick={() => {onclickPhoto(index)}}>
                    <button
                      id={index}
                      
                      className="pictureButton"
                    > 
                      {/*Contains all the text that shows when the user hovers over the photo button*/}
                      <div className='tooltiptextpic'>
                        <br/>
                        <p>{photo.caption}</p>
                        <br/>        
                        <p>{photo.date}</p>
                        <br/>        
                        <p>{photo.description}</p>
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

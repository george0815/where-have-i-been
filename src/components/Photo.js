import {React, useState} from 'react'; //React
import Background from './Background'; //Gets background
import Navbar from './Navbar';
import Editing from './Editing';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Photo.css';
 


//Photo page
export default function Photo(props) {


  //---------------------------STATE--------------------------------//

  //sets up current photo state
  const [currentPhoto, setCurrentPhoto] = useState(JSON.parse(sessionStorage.getItem("currentPhoto"))); 

  //sets up state for fullscreen
  const [fullScreen, setFullscreen] = useState(false); 

  //sets up state for //sets up state for editing props
  const [editingSettings, setEditingSettings] = useState(

    {
        adding: false,
        isAlbum: false,
        saveButtonText: "Save",
        currentlyEditing: false
    }

  ); 

  //--------------------------FUNCTIONS-----------------------------//

  //displays image at maximim size while not going over either the viewport width or height
  function onClickFullscreen(){setFullscreen(true); }

  //displays editing component
  function onClickEdit(){ setEditingSettings(
    
    {
        adding: false,
        isAlbum: false,
        saveButtonText: "Save",
        currentlyEditing: true
    }

  );}


  //hides editing component and refreshes state
  function onEditExit(){ setEditingSettings(
    
    {
        adding: false,
        isAlbum: false,
        saveButtonText: "Save",
        currentlyEditing: false
    }

  );}


  function exitFullscreen(){
    setFullscreen(false); 
    console.log("test");
  }



  //------------------------JSX OBJECT------------------------------//

 
  return (

    <div className='componentContainer transparentBackground'>

        <Navbar fullScreen={fullScreen} loggedIn={props.loggedIn} page={3} onClickEdit={onClickEdit}/>

        {/*Holds all elements in the photo page*/}
        <div className="mainPhotoContainer">

             {/*Contains fullscreen version of photo*/}
             <div className={editingSettings.currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
                  <Editing loggedIn={props.loggedIn}  editingSettings={editingSettings} setCurrentPhoto={setCurrentPhoto} onEditExit={onEditExit} currentPhoto={currentPhoto} />
            </div>

            {/*Contains fullscreen version of photo*/}
            <div onClick={exitFullscreen} className={fullScreen ? 'fullscreenPhotoContainer activeFullscreen' : 'fullscreenPhotoContainer fadeOut'}>  
                <img src={currentPhoto.img} className="fullscreenPhoto"/>
            </div>

            {/*left arrow*/}
            <button className='arrow'>↩</button>

            {/*Holds the photo, info, caption, and fullscreen button*/}
            <div className='photoContainer'>

                {/*Holds the photo and tool tip*/}
                <div className="photo"> 
                    
                    {/*holds all the text and tags that display when the user hovers over the photo*/}
                    <div className='tooltiptext'>
                            
                        <p>{currentPhoto.description}</p>
                        <nav className='tagContainer'>
                            {currentPhoto.tags.map((tag) => (

                                <div className='tag'>{tag}</div>

                            ))}
                        </nav>

                    </div>
                    {/*actual photo*/}
                    <img src={currentPhoto.img}/> 
                </div>

                {/*Holds the caption, date and time, and fullscreen button*/}
                <div className='captionContainer'>
                    <p className='caption'>{currentPhoto.caption}     <span className='dateline'>{currentPhoto.location} - {currentPhoto.date}</span></p>
                    <button onClick={onClickFullscreen} className='fullscreenButton'>Fullscreen</button>
                </div>

            </div>
                    
            {/*right arrow*/}
            <button className='arrow'>↪</button>

            {/*background*/}
            <Background isMain={false}/>
        
        </div>
      </div>


  );
}
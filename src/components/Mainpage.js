import { useState, React } from 'react'; //React
import Background from './Background'; //Gets background
import Navbar from './Navbar'; //navbar
import Editing from './Editing'; //editing component
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Navbar.css';


//main page
export default function Mainpage(props) {

  const [currentCaption, setCurrentCaption] = useState("Phuket, Thailand") // sets initial caption at the bottom

  //sets captions
  function setCaption(cap) { setCurrentCaption(cap);}


  //sets up state for editing props
  const [editingSettings, setEditingSettings] = useState(

    {
        adding: false,
        isAlbum: true,
        saveButtonText: "Save",
        currentlyEditing: false
    }
  )




  //creates guest album
  function onClickCreateAlbumAsGuest(){ setEditingSettings(
    
    //ask user via alert


    {
        adding: true,
        isAlbum: true,
        saveButtonText: "Add",
        currentlyEditing: true
    }

  );}

  return (

    //holds entire page
    <div className='componentContainer'>

      <Navbar setLoggedIn={props.setLoggedIn}  loggedIn={props.loggedIn} page={0}/>

      {/*Holds all elements in the main page*/}
      <div className="mainPageContainer">

        {/*Contains fullscreen version of photo*/}
        <div className={editingSettings.currentlyEditing ? 'editingComponentContainer activeEditing' : 'editingComponentContainer'}>  
            <Editing  loggedIn={props.loggedIn} editingSettings={editingSettings} onEditExit={onEditExit} currentPhoto={currentPhoto} currentAlbum={currentAlbum}/>
        </div>

        {/*Holds all the text in the main page, except for picture caption at the bottom left*/}
        <div className="mainTextContainer">A free, online photo album
            <br/>
                <span>Never lose your memories, <br/>save every experience</span>
            <br/><br/><br/><br/><br/><br/>
            <p>Login or <button onClick={onClickCreateAlbumAsGuest}>create an album as a guest</button></p>
        </div>
        
        
        {/*background*/}
        <Background setCurrentCaption={setCaption} isMain={true}/>
   

        {/*background caption*/}
        <p className="backgroundCaption">{currentCaption}</p>
      </div>
    </div>


  );
}

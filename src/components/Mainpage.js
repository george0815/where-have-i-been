import { useState, React } from 'react'; //React
import Background from './Background'; //Gets background
import Navbar from './Navbar';
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Navbar.css';


//main page
export default function Mainpage() {

  const [currentCaption, setCurrentCaption] = useState("Phuket, Thailand") // sets caption at the bottom

  //sets captions
  function setCaption(cap) { setCurrentCaption(cap);}

  return (

    <div className='componentContainer'>

      <Navbar page={0}/>

      {/*Holds all elements in the main page*/}
      <div className="mainPageContainer">

        {/*Holds all the text in the main page, except for picture caption at the bottom left*/}
        <p className="mainTextContainer">A free, online photo album
            <br/>
                <span>Never lose your memories, <br/>save every experience</span>
            <br/><br/><br/><br/><br/><br/>
            <p>Login or <button>create an album as a guest</button></p>
        </p>
        
        
        {/*background*/}
        <Background setCurrentCaption={setCaption} isMain={true}/>
   

        {/*background caption*/}
        <p className="backgroundCaption">{currentCaption}</p>
      </div>
    </div>


  );
}

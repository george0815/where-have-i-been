import {React, useState} from 'react'; //React
import Background from './Background'; //Gets background
import germany from '../images/test/germany.jpg';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Photo.css';
 


//Photo page
export default function Photo() {


  //displays image at maximim size while not going over either the viewport width or height
  function onClickFullscreen(){

  }

  //sets up current photo state
  const [currentPhoto, setCurrentPhoto] = useState(JSON.parse(sessionStorage.getItem("currentPhoto"))); 

 
  return (

      //Holds all elements in the photo page
      <div className="mainPhotoContainer">

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
                <p className='caption'>{currentPhoto.name}     <span className='dateline'>{currentPhoto.location} - {currentPhoto.date}</span></p>
                <button className='fullscreenButton'>Fullscreen</button>
            </div>

        </div>
                
        {/*right arrow*/}
        <button className='arrow'>↪</button>

        {/*background*/}
        <Background isMain={false}/>
   

        
      </div>

  );
}
import { useState, useRef, useEffect, React } from 'react'; //React
import Background from './Background'; //Gets background
import albumsObj from './Testalbums'; //gets globe logo

//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Picturespage.css';




//login page
export default function Picturespage() {

  console.log(albumsObj);
  
  const albumThumbnails = albumsObj.map((album, index) => (
    <button
      id={index}
      key={album.name}
      className="pictureButton"
    > <div className='tooltiptextpic'>
        <br/>
        <p>{album.name}</p>
        <br/>        

        <p>{album.location} - {album.date.from}</p>

       
      </div>
      <img src={album.img}/> 

    </button>
  ))
  console.log(albumThumbnails);



  return (

       //Holds all elements in the main page
       <div className="picturePageContainer">

       {/*main div that hold all the login promps and buttons*/}
        <div className="pictureContainer">

            {/* albums*/}
            {albumThumbnails}
        
        </div>
       
       
       {/*background*/}
        <Background isMain={false}/>
  

       
     </div>

  );
}

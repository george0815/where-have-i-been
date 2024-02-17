import { useState, useRef, useEffect, React } from 'react'; //React
import Background from './Background'; //Gets background
import albumsObj from './Testalbums'; //gets globe logo

//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Albumspage.css';




//login page
export default function Albumspage() {

  console.log(albumsObj);
  
  const albumThumbnails = albumsObj.map((album, index) => (
    <button
      id={index}
      key={album.name}
      className="albumButton"
      src={album.img} 
    > <div className='tooltiptext'>
        <br/>
        <p>{album.name}</p>
        <p>{album.location} - {album.date.from} to {album.date.to}</p>
        <br/>        

        <p>{album.description}</p>
        <br/>     
        <nav className='tagContainer'>
        {album.tags.map((tag) => (<div className='tag'> {tag}</div>))}
        </nav>
      </div>
      <img src={album.img}/> 
    </button>
  ))
  console.log(albumThumbnails);



  return (

       //Holds all elements in the main page
       <div className="albumPageContainer">

       {/*main div that hold all the login promps and buttons*/}
        <div className="albumContainer">

            {/* albums*/}
            {albumThumbnails}
        
        </div>
       
       
       {/*background*/}
        <Background isMain={false}/>
  

       
     </div>

  );
}

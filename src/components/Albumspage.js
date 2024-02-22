import {React } from 'react'; //React
import Background from './Background'; //Gets background
import albumsObj from './Testalbums'; //gets globe logo
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Albumspage.css';




//Alubums page
export default function Albumspage() {

  //creates each album button from data, it pulls data from a database if the user is signed in
  //or localstorage if the user doens't have an account   
  const albumThumbnails = albumsObj.map((album, index) => (
    <button
      id={index}
      key={album.name}
      className="albumButton"
      src={album.img}         
    > 
     {/*Contains all the text that shows when the user hovers over the album button*/}
      <div className='tooltiptext'>
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
      <img src={album.img} alt={album.description}/> 
    </button>
  ))



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

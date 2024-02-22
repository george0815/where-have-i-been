import {React} from 'react'; //React
import Background from './Background'; //Gets background
import albumsObj from './Testalbums'; //gets globe logo
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Picturespage.css';


 

//login page
export default function Picturespage() {

  //creates each picture button from data, it pulls data from a database if the user is signed in
  //or localstorage if the user doens't have an account     
  const albumThumbnails = albumsObj.map((album, index) => (
    
    <button
      id={index}
      key={album.name}
      className="pictureButton"
    > 
      {/*Contains all the text that shows when the user hovers over the photo button*/}
      <div className='tooltiptextpic'>
        <br/>
        <p>{album.name}</p>
        <br/>        
        <p>{album.location} - {album.date.from}</p>
      </div>
      {/*actual photo*/}
      <img src={album.img}/> 

    </button>
  ))



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

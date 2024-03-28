import { useState, useEffect, React } from 'react'; //React
import logo from '../images/logo.svg'; //gets globe logo
import {countries} from "countries-list"; //gets list of every country (used for title)
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'; //gets link from react router
//firebase
import { doc, setDoc} from "firebase/firestore"; 
import { storage, db} from "../firebase";
import {ref, deleteObject} from "firebase/storage";
//zip and file save
import  JSZip from 'jszip';
//CSS
import '../styles/Navbar.css';
import '../styles/fonts.css';


//navbar, used in every page except the login page
export default function Navbar(props) {


  //---------------------------STATE--------------------------------//

  //initiates title
  const [country, setCurrentCountry] = useState("Where have I been?") // set currrent slide index

  //--------------------------FUNCTIONS-----------------------------//

  //used for page redirects
  const navigate = useNavigate();

  //CONVERTS FILE TO BLOB FOR DOWNLOAD
  async function getBlob(src){
    const image = await fetch(src)
    const imageBlog = await image.blob()
    return URL.createObjectURL(imageBlog)
  }

  //DOWNLOADS IMAGE OR ALBUM
  async function downloadImage() {

    //if user is downloading individual photo
    if(props.page === 3){
      let currentPhoto = JSON.parse(sessionStorage.getItem("currentPhoto"));
      const link = document.createElement('a')
      link.href = await getBlob(currentPhoto.img);
      link.download = currentPhoto.caption;
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    //if user is downloading album
    else if(props.page === 1){

      
      //DOWNLOADS IMAGES
      async function downloadImages(imageSources, zipFileName) {
        const zip = new JSZip();
      
        //HELPER FUNCTION, ADDS EACH IMAGE TO ZIP
        async function addImageToZip(src, index) {

          const image = await fetch(src)
          const imageBlob = await image.blob()
         
          // Add the blob to the zip file with a unique name
          zip.file(`${imageSources[index].caption}.png`, imageBlob);
        }
      
        // Use Promise.all to fetch and add all images concurrently
        await Promise.all(imageSources.map((photo, index) => {
          return addImageToZip(photo.img, index);
        }));
      
        // Generate the zip file
        const content = await zip.generateAsync({ type: 'blob' });
      
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = zipFileName;
        link.click();
      }
      //gets current album then passes it to downloadImages
      let currentAlbum = JSON.parse(sessionStorage.getItem("currentAlbum"));
      downloadImages(currentAlbum.photos, currentAlbum.caption);

    }
    
  }



  //REMOVES IMAGE OR ALBUM
  async function remove(){

    //displays alert asking user if they want to remove  
    if (window.confirm( + (props.page === 1) ? "Are you sure you want to delete this album?" : "Are you sure you want to delete this photo? Note: if this is the last photo in the album, the album itself will also be removed.")) {
      
      //make new temp album object from localstorage albums object
      let tempAlbums = JSON.parse(localStorage.getItem("albums"));

      //gets index for current album
      let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});

      //if user is deleting album
      if(props.page === 1){


        //saves photos so that they can be deleted from the database later on
        let photosToBeDeleted = tempAlbums[index].photos;

        
        tempAlbums.splice(index, 1); // 2nd parameter means remove one item only



        //removes from database
        if(props.loggedIn){
          await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
            ...tempAlbums
          });

          //deletes photos
          photosToBeDeleted.forEach((photo)=>{
          
            // Create a reference to the file to delete
            const photoRef = ref(storage, photo.id);
            // Delete the file
            deleteObject(photoRef).then(() => {
              // File deleted successfully
            }).catch((error) => {
              window.alert(error);
            });

          })
        }
        localStorage.setItem('albums', JSON.stringify(tempAlbums));
        //alters app state, effectively refreshing page
        props.setAlbums(tempAlbums);
        navigate("/");


      }

      //if user is deleting photo
      else if(props.page === 3){

        //get index for photo to be deleted
        let toBeDeletedIndex = tempAlbums[index].photos.findIndex(photo => {return JSON.parse(sessionStorage.getItem("currentPhoto")).id === photo.id});


        // Create a reference to the file to delete
        const photoRef = ref(storage, tempAlbums[index].photos[toBeDeletedIndex].id);

        //delete from array
        tempAlbums[index].photos.splice(toBeDeletedIndex, 1);

        
        //delete from database
        if(props.loggedIn){
          await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
            ...tempAlbums
          });

          // Delete the file
          deleteObject(photoRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            window.alert(error);
          });
        }

        //updates storage and refreshes page

        //if user deleted last photo in album
        if(tempAlbums[index].photos.length === 0){
          tempAlbums.splice(index, 1); 
          localStorage.setItem('albums', JSON.stringify(tempAlbums));
          props.setAlbums(tempAlbums);
          navigate("/");
        }
        else{
          sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));
          localStorage.setItem('albums', JSON.stringify(tempAlbums));
          navigate("/album");
        }
        
      }

    } 

  }


  //HANDLES SORTING
  function onClickSort(evt) {

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));


    //sorts albums if user is on albums page
    if(props.page === 2){

        switch(evt.target.value) {
          //sort by date ascending
          case "date (asc)":
            tempAlbums = tempAlbums.sort(function(a,b){
              return new Date(Date.parse(a.date)) - new Date(Date.parse(b.date));
            })   
            break;
          //sort by date descending
          case "date (desc)":
            tempAlbums = tempAlbums.sort(function(a,b){
              return new Date(Date.parse(b.date)) - new Date(Date.parse(a.date));
            })         
            break;
          //sort by whatever category user chose
          default:
            tempAlbums = tempAlbums.sort(stringSort(evt.target.value)) ;
        }

      //saves to local storage and refreshes albums
      localStorage.setItem('albums', JSON.stringify(tempAlbums));
      props.updateAlbums(); 
    }


    //sorts photos if user is on a page or an individual album
    else if(props.page === 1){

      //gets index of current album
      let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});


      switch(evt.target.value) {
        //sort by date ascending
        case "date (asc)":
          tempAlbums[index].photos = tempAlbums[index].photos.sort(function(a,b){
            return new Date(Date.parse(a.date)) - new Date(Date.parse(b.date));
          })   
          break;
        //sort by date descending
        case "date (desc)":
          tempAlbums[index].photos = tempAlbums[index].photos.sort(function(a,b){
            return new Date(Date.parse(b.date)) - new Date(Date.parse(a.date));
          })         
          break;
        //sort by whatever value user chose
        default:
          tempAlbums[index].photos = tempAlbums[index].photos.sort(stringSort(evt.target.value));
        }
      

      //set currentAlbum in session storage
      sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

      //call function to reset pictures page
      props.updatePictures();


    }
         
    //reset the select value to always show sort
    evt.target.value = "Sort by..."

  }




  //FUNCTION THAT SORT ARRAY OF OBJECT BY A STRING PROPERTY IN OBJECT
  function stringSort(prop) {

    return function (a, b){
      const stringA = a[prop].toUpperCase(); // ignore upper and lowercase
      const stringB = b[prop].toUpperCase(); // ignore upper and lowercase
        
      //sort in an ascending order
      if (stringA < stringB) {return -1;}
      if (stringA > stringB) {return 1;}
    
      // names must be equal
      return 0;
    }
  }


  //UPDATES SEARCH TAG STATE, USES BY PICTURESPAGE AND ALBUMSPAGE TO SEARCH 
  function onTagInputChange(e){props.setSearchTag(e.target.value); }


  
  //SETS THE TITLE TO A RANDOM COUNTRIES NAME EVERY 100MS EVERY 15 SECONDS
  function showCountries(i) {
    let keys = Object.keys(countries);

    setTimeout(function () {
      //only get countries whos names are less that 18 characters
      let moreThan18Char = true;
      while(moreThan18Char){
        //get random number for index
        let randomNum = Math.floor(keys.length * Math.random())
        if(countries[keys[randomNum]].name.length < 18){
          moreThan18Char = false;
          //set state
          setCurrentCountry(countries[keys[randomNum]].name);
        }
      }

      //set the title back to normal
        if(i === 20){setCurrentCountry("Where have I been?"); 
      }
    }, i * 100);
  }


  //LOG OUT USER AFTER THEY CONFIRM
  function logout(){
    if (window.confirm("Are you sure you want to logout?")) {
    
      //set loggedIn local storage value to true and go to main page
      localStorage.setItem('user', null);
      props.setLoggedIn(false);
      navigate("/");
    
    }
  }


  //sets profile button
  let profileButton = !props.loggedIn ? <Link to="../login"><button className="navButton">{"Login"}</button></Link> : 
  <button onClick={logout} className="navButton">{"Logout"}</button>



  //--------------------------USE EFFECT-----------------------------//


  //every 15 seconds set the title to a series of random countrys' names
  useEffect(() => {
    let titleTextInterval = setInterval(() => {for(let i = 0; i <= 20; i++){showCountries(i);}}, 15000);
    return () => {  clearInterval(titleTextInterval) }
  },[])


  //------------------------JSX OBJECT------------------------------//


  return (

    //whole navbar
    <nav className={props.fullScreen ? 'mainNav mainNavFullscreen' : 'mainNav'} >
      {/* title*/}
      <Link className="logo" to="/">{country}</Link>
      
      {/* logo*/}
      <img src={logo} alt="Site logo - a silhouette of a globe"/>

      {/*Holds all buttons */}
      <div className="navButtonContainer">
        {/*New album and add photo buttons*/}
        {props.page === 2 && <button onClick={props.onClickAdd} className="navButton">New album</button>}
        {props.page === 1 && <button onClick={props.onClickAdd} className="navButton">Add photo</button>}
        {/*remove and edit buttons*/}
        {(props.page === 1 || props.page === 3) && <button onClick={remove} className="navButton">Remove</button>}
        {(props.page === 1 || props.page === 3) && <button onClick={props.onClickEdit} className="navButton">Edit</button>}
        {/*sort*/}
        {(props.page === 1 || props.page === 2) && <select className="navButton sort" onChange={(e) => {onClickSort(e)}}>
          <option defaultValue="Sort by...">Sort by...</option>
          <option>{"date (asc)"}</option> {/*sorts by date ascending*/}
          <hr/>
          <option>{"date (desc)"}</option> {/*sorts by date descending*/}
          <hr/>
          <option>caption</option>{/*sorts by caption*/}
          <hr/>
          <option>description</option> {/*sorts by description*/}
          <hr/>
          <option>location</option>{/*sorts by location*/}
        </select>}
        {/*search button*/}
        {(props.page === 1 || props.page === 2) && <input onChange={(e) => {onTagInputChange(e)}} placeholder='search'/>}
        {/*download button*/}
        {(props.page === 1 || props.page === 3) && <button onClick={(e) => {downloadImage()}} className="navButton">Download</button>}
        {/*login/logout button*/}
        {props.page !== 5 && profileButton}
      </div>

    </nav>
  );
}


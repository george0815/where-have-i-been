import {React, useState, useEffect} from 'react'; //React
//firebase
import { doc, setDoc } from "firebase/firestore"; 
import { storage, db} from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";
import exifr from 'exifr' //used to extract exif data
import DatePicker from 'react-date-picker'; //nice date picker
//api used to get an address from coordinates received from exif data
import {
  setDefaults,
  geocode,
  RequestType,
} from "react-geocode";
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Editing.css';
import '../styles/Navbar.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';



export default function Editing(props) {

  //---------------------------STATE--------------------------------//

   //sets up state for value that display upload progress
  const [uploadPercent, setUploadPercent] = useState(0.0) //how much of the current file is uploaded
  const [currentUpload, setCurrentUpload] = useState(0) //amount of files currently uploaded
  const [uploadFileName, setUploadFileName] = useState("") //name of the file being currently uploaded
  const [totalUploads, setTotalUploads] = useState(0) //total uploads for the albums
  const [isUploading, setIsUploading] = useState(false); //if client is currently uploaded


  //sets up tag state
  const [tags, setTags] = useState( props.editingSettings.isAlbum ? props.currentAlbum.tags :  props.currentPhoto.tags); 


  //sets up album state
  const [input, setInput] = useState(

    {
      description: "",
      location: "",
      caption: ""
    }

  ); 

  //from date state
  const [fromDateValue, onFromChange] = useState(props.editingSettings.adding ? new Date() : (props.editingSettings.isAlbum) ? props.currentAlbum.date : props.currentPhoto.date);

  //to date state
  const [toDateValue, onToChange] = useState((!props.editingSettings.adding && props.editingSettings.isAlbum) ? props.currentAlbum.dateTo : new Date());



  //--------------------------FUNCTIONS-----------------------------//


  //RECEIVES FILE AND RETURNS IT IN BASE64
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  
  }

  //SETS DEFAULT SETTINGS FOR GEOLOCATE API
  setDefaults({
    key: "AIzaSyAowkd_pNDHGK5ZVBfugs2uw3gt182uvL4", // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
  });


  //GETS METADATA FROM FILE
  function getMetaData(file) {
    return new Promise((resolve, reject) => {
      exifr.parse(file)
      .then(output => {
        

        //if proper coords were received from the parsed exif data
        if(typeof output !== 'undefined' && (typeof output.latitude !== 'undefined' && typeof  output.longitude !== 'undefined')){

          //convert into format to be read by API
          let coords = output.latitude + "," + output.longitude 

          //get address from coords
          geocode(RequestType.LATLNG, coords, {
            location_type: "ROOFTOP", // Override location type filter for this request.
            enable_address_descriptor: true, // Include address descriptor in response.
          })
          //return resuls
          .then(({ results }) => {
            const { city, state, country } = results[0].address_components.reduce(
              (acc, component) => {
                if (component.types.includes("locality"))
                  acc.city = component.long_name;
                else if (component.types.includes("administrative_area_level_1"))
                  acc.state = component.long_name;
                else if (component.types.includes("country"))
                  acc.country = component.long_name;
                return acc;
              },
              {}
            );

            //create location object 
            let locationObject = {
              city : city,
              state : state, 
              country : country
            }
        
            //merge location object with the rest of metadata
            let tempObj = {
              ...output,
              ...locationObject
            }

            //resolve promise
            resolve(tempObj);

          })
          .catch(console.error);
        }
        //if no metadata, return nothing
        else{ resolve(null);}
            
      
      });
    });
  
  }



  //UPLOADS FILE TO FIRESTORE BUCKET AND RETURNS USEABLE URL
  function getURL(storageRef, file) {
    return new Promise((resolve, reject) => {

      //firebase upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);

          //updates state and thus, ui
          setUploadPercent(progress);
          setUploadFileName(file.name);
          
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          
          //incremets uploaded files by 1 and returns image URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCurrentUpload(currentUpload => currentUpload + 1);
            resolve(downloadURL);
          });
        }
      );
    
    })
  }



  //HELPER FUNCTION, ADDS PHOTO TO ALBUM
  async function addPhotoAlbumData(src){

          //make new temp album object from localstorage albums object
          let tempAlbums = JSON.parse(localStorage.getItem("albums"));
          let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});


          //create temp photo object from input, and tempalbum
          let tempPhoto = {
            img : src,
            id :  Date.now().toString(),
            caption : document.getElementById("caption").value,
            location : document.getElementById("location").value,
            date : Object.prototype.toString.call(fromDateValue) === '[object Date]' ? fromDateValue.toDateString() : fromDateValue,
            description : document.getElementById("description").value,
            tags : tags
          }
      
          //replace data with data from inputs
          tempAlbums[index].photos.push(tempPhoto);
          
   
          //overwrite albums object in local storage
          localStorage.setItem('albums', JSON.stringify(tempAlbums));
          sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));

          //uploads doc to firebase
          if(props.loggedIn){
            await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
              ...tempAlbums
            });
          }

          //call some sort of function that hides the editing component again and resets currentalbum state
          props.onEditExit();


  }
 
 

  //WHEN USER CLICK ADD, ADDS PHOTO OR ALBUM 
  function addPhotoAlbum(){


    //gets files from file input
    let fileInput = document.getElementsByClassName("fileInput")[0];
    const files = fileInput.files;


    //if user is adding photo, 
    if(!props.editingSettings.isAlbum && props.editingSettings.adding){
      let photoId = Date.now().toString();
      const storageRef = ref(storage, photoId);
      //get photo url then call helper function to add it into album
      !props.loggedIn ? getBase64(files[0]).then( data => addPhotoAlbumData(data)) : getURL(storageRef, files[0]).then( data => addPhotoAlbumData(data));  
    }


    //if user is adding album
    else if(props.editingSettings.isAlbum && props.editingSettings.adding){


      //sets up loading progress element by setting total uploads and isUploading states
      setTotalUploads(Array.from(files).length);
      setIsUploading(true);

      //make new temp album object from localstorage albums object
      let tempAlbums = JSON.parse(localStorage.getItem("albums"));

      //add album data 
      let tempAlbum = {
        caption : document.getElementById("caption").value,
        location : document.getElementById("location").value,
        date : Object.prototype.toString.call(fromDateValue) === '[object Date]' ? fromDateValue.toDateString() : fromDateValue,
        dateTo : Object.prototype.toString.call(toDateValue) === '[object Date]' ? toDateValue.toDateString() : toDateValue,
        description : document.getElementById("description").value,
        tags : tags,
        img: "",
        id : Date.now().toString(),
        photos : []
      }


      //GETS ALL FILEPATHS AND METADATE FROM EACH PHOTO BEFORE UPLOADING THEM TO ALBUM
      async function asyncCall() {

        const filePathsPromises = []; //for url
        const metaDataPromises = []; //for metadata

        Array.from(files).forEach((file) => {


          //creates photoid from date and creates storage reference for it in firebase
          let photoId = Date.now().toString();
          const storageRef = ref(storage, photoId);

          //pushes promises that return either url or metadata to their respective array
          filePathsPromises.push(props.loggedIn ? getURL(storageRef, file) : getBase64(file));
          metaDataPromises.push(getMetaData(file));

          //pushes photo to newly created album
          tempAlbum.photos.push(

            {
              id :  photoId,
              key: photoId,
              caption : file.name,
              location : "",
              date : "",
              description : "",
              tags : []
            }

          );
        });

        //resolves promises, receiving metadata and urls
        const filePaths = await Promise.all(filePathsPromises);
        const metaData = await Promise.all(metaDataPromises);

        //adds urls to photos
        tempAlbum.photos = filePaths.map((base64File, index) => (
          {
            ...tempAlbum.photos[index],
            img : base64File,       
          }
        ));

        //adds metadata to photos
        tempAlbum.photos = metaData.map((data, index) => (
          {
            ...tempAlbum.photos[index],
            date : (data !== null && data.DateTimeOriginal !== null) ? data.DateTimeOriginal.toDateString() : files[index].lastModifiedDate.toDateString(),
            location : (data !== null && data.country !== null) ? data.city + ", " + data.state + ", " + data.country : ""
          }
        ));

        //sets album thumbnail image to first image in album
        tempAlbum.img = tempAlbum.photos[0].img;

        //replace data with data from inputs
        tempAlbums.push(tempAlbum);
          
        //overwrite albums object in local storage
        localStorage.setItem('albums', JSON.stringify(tempAlbums));

        //uploads doc to firebase
        if(props.loggedIn){
          await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
            ...tempAlbums
          });
        }
        
        //unrenders loading progress element
        setIsUploading(false);


        //call some sort of function that hides the editing component again and resets currentalbum state
        props.onEditExit();
      }

      //actually calls function declared above
      asyncCall();
        
    }
  }



  //WHEN INPUT CHANGES, UPATE STATE (AND THUS, UI)
  function onInputChange(e){
      setInput( prevInput => {
        return { ...prevInput,  [e.target.name]: e.target.value}
      })
  }

 

  //REMOVES TAG
  function removeTag(e){
    let tempTags = tags
    let index = tempTags.findIndex(tag => {return e.target.innerText === tag}); //gets index
    tempTags.splice(index, 1); // 2nd parameter means remove one item only
    setTags((tempTags) => [...tempTags]);
  }




  //HANDLES SAVE FUNCTIONAILITY
  async function onClickSave(){

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));
    let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});

    //if user is editing album
    if(props.editingSettings.isAlbum){

      //replace data with data from inputs
      tempAlbums[index].caption = document.getElementById("caption").value;
      tempAlbums[index].location = document.getElementById("location").value;
      tempAlbums[index].date = Object.prototype.toString.call(fromDateValue) === '[object Date]' ? fromDateValue.toDateString() : fromDateValue;
      tempAlbums[index].dateTo = Object.prototype.toString.call(toDateValue) === '[object Date]' ? toDateValue.toDateString() : toDateValue;
      tempAlbums[index].description = document.getElementById("description").value;
      tempAlbums[index].tags = tags;
   
      //overwrite albums object in local storage
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

      //uploads doc to firebase
      if(props.loggedIn){
        await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
          ...tempAlbums
        });
      }

    }
    //if user is editing photo
    else if(!props.editingSettings.isAlbum){

      //gets index of current photo
      let photoIndex = tempAlbums[index].photos.findIndex(photo => {return JSON.parse(sessionStorage.getItem("currentPhoto")).id === photo.id});


      //replace data with data from inputs
      tempAlbums[index].photos[photoIndex].caption = document.getElementById("caption").value;
      tempAlbums[index].photos[photoIndex].location = document.getElementById("location").value;
      tempAlbums[index].photos[photoIndex].date = Object.prototype.toString.call(fromDateValue) === '[object Date]' ? fromDateValue.toDateString() : fromDateValue;
      tempAlbums[index].photos[photoIndex].description = document.getElementById("description").value;
      tempAlbums[index].photos[photoIndex].tags = tags;

      //overwrite albums object in local storage
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

      //overwrite currentAlbum object
      sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));


      //overwrite current photo object in session storage
      sessionStorage.setItem("currentPhoto", JSON.stringify(tempAlbums[index].photos[photoIndex]));

      //uploads doc to firebase
      if(props.loggedIn){
        await setDoc(doc(db, "data", JSON.parse(localStorage.getItem("user")).uid), {
          ...tempAlbums
        });
      }

      //refresh
      props.setCurrentPhoto(tempAlbums[index].photos[photoIndex]);

    }

    //call some sort of function that hides the editing component again and resets currentalbum state
    props.onEditExit();


  }



  //HANDLES ADDING TAG
  function onClickAddTag(){

    //if tag is already added
    if(tags.includes(document.getElementsByClassName("tagInput")[0].value)){ window.alert("Tag already added");}
    //if user has already add the max amount of tags
    else if(tags.length >= 10){window.alert("Reached tag limit");} 
    //if other checks pass adds tag
    else{
      let tempTags = tags
      //pushes to tag array then updates state
      tempTags.push(document.getElementsByClassName("tagInput")[0].value)
      setTags((tempTags) => [...tempTags]);
      //resets value
      document.getElementsByClassName("tagInput")[0].value = "";
    }

  }







  
  //--------------------------USE EFFECT-----------------------------//

  //refreshes editing components inputs whenever there is any change in the editing components settings
  useEffect(() => {

    setInput(props.editingSettings.isAlbum ?
      {
        description: props.currentAlbum.description,
        location: props.currentAlbum.location,
        caption: props.currentAlbum.caption
      }
  
      :
  
      {
        description: props.currentPhoto.description,
        location: props.currentPhoto.location,
        caption: props.currentPhoto.caption
      }
    )

    setTags(props.editingSettings.isAlbum ? props.currentAlbum.tags :  props.currentPhoto.tags)
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editingSettings])


  //------------------------JSX OBJECT------------------------------//


  return (

        //main div that hold all the login promps and buttons
        <div className="editingContainer">

            {/*Close button */}
            <button onClick={props.onEditExit} className='closeButton'>&#10005;</button>

            {/* Caption and Location*/}
            <div className='captionLocation'>
               {/* Caption*/}
              <div className='inputContainerEditing'>
                <label htmlFor="name">Caption</label>
                <input
                  maxLength={25}
                  type="text"
                  placeholder="caption"
                  name="caption"
                  id="caption"
                  className='input'
                  value={input.caption}
                  onChange={onInputChange}

                />    
              </div>
               {/*Location*/}
              <div className='inputContainerEditing location' >
                <label htmlFor="location">Location</label>
                <input
                  maxLength={25}
                  className='input'
                  type="text"
                  placeholder="location"
                  name="location"
                  id="location"
                  value={input.location}
                  onChange={(e) => {onInputChange(e)}}

                />  
              </div>
            </div> 


            {/* Date and time*/}
            <div className='dateTime'>
      
                <div className='inputContainerEditing'>
                  <label htmlFor="dateAndTime">Date and Time</label>
                  <div className='dateInputContainer'>

                    {/*If the user is currently adding or editing an
                    album, a second input box is displayed so they can enter a range of dates*/}
                    <DatePicker onChange={onFromChange} value={fromDateValue}
                      className='dateAndTime'
                      type="text"
                      placeholder = {props.editingSettings.isAlbum ? "from" : "date and time"}
                      name="fromDate"
                      id="fromDate"
                    />    
                    { props.editingSettings.isAlbum && <div className='toLabel'> to</div>}
                    { props.editingSettings.isAlbum &&  <DatePicker onChange={onToChange} value={toDateValue}
                      className='toDate'
                      type="text"
                      placeholder="to"
                      name="toDate"
                      id="toDate"
                    />  
                    } 
                  </div>
                </div>
            </div>     

            {/* Description */}
            <div className='description'>
              <div className='inputContainerEditing'>

                <label htmlFor="description">Description</label>
                <textarea
                  maxLength={275}
                  rows={6}
                  placeholder= {props.editingSettings.isAlbum ? "What kinds of pictures are in this album?" : "What inspired you to take this photo?"}
                  name="description"
                  className='descriptionInput'
                  id="description"
                  value={input.description}
                  onChange={onInputChange}
                />   
              </div>  
            </div>  


            {/*Tags and button*/}
            <div className='tagsEditing'>

              {/*Contains the input and button to add a new tag*/}
              <div className='inputTagContainer'>

                <div className='inputContainerEditing'>

                  <label title="Tags can be used to search for a given photo or album. To remove a tag, just click on it's button." htmlFor="tagInput">Tags</label>
                  <div className='addTagRow'>
                    <input
                      maxLength={15}
                      type="text"
                      placeholder="tag name"
                      name="tagInput"
                      className='tagInput input'
                    />   
                    <button className='addTag' onClick={onClickAddTag}>Add tag</button>
                  </div>
 
                </div>   

              </div>   

              {/*Contains actual tags*/}
              <div className='tagsContainerEditing'> {tags.map((tag) => (<button onClick={(e) => {removeTag(e)}} key={tag} className='tag'> {tag}</button>))}</div>
            </div>     
               
            {/*Save Button*/}
            <button className='saveButton' onClick={!props.editingSettings.adding ? onClickSave : null}>
                {props.editingSettings.saveButtonText}
                {props.editingSettings.adding && <input onChange={addPhotoAlbum} className="fileInput" type="file" multiple />}
            </button>

             {/*Loading progress div*/}
            {isUploading && <div className='loadingProgress'>
              Uploading {uploadFileName} - {uploadPercent}% <br/>
              {currentUpload} of {totalUploads}
            </div>}


        </div>
       
    

  );
}

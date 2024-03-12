import {React, useState, useEffect} from 'react'; //React
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../firebase"
import { storage} from "../firebase";
import exifr from 'exifr' // => exifr/dist/full.umd.cjs
import { uploadBytesResumable, ref, getDownloadURL} from "firebase/storage";
import DatePicker from 'react-date-picker';

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


//login page
export default function Editing(props) {

  //---------------------------STATE--------------------------------//

   //sets up state for value that display upload progress
  const [uploadPercent, setUploadPercent] = useState(0.0)
  const [currentUpload, setCurrentUpload] = useState(0)
  const [uploadFileName, setUploadFileName] = useState("")
  const [totalUploads, setTotalUploads] = useState(0)
  const [isUploading, setIsUploading] = useState(false);




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

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  
  }

  setDefaults({
    key: "AIzaSyAowkd_pNDHGK5ZVBfugs2uw3gt182uvL4", // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
  });

  function getMetaData(file) {
    return new Promise((resolve, reject) => {
      exifr.parse(file)
      .then(output => {
        

        if(output){

          let coords = output.latitude + "," + output.longitude 

        geocode(RequestType.LATLNG, coords, {
          location_type: "ROOFTOP", // Override location type filter for this request.
          enable_address_descriptor: true, // Include address descriptor in response.
        })
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

            let locationObject = {

              city : city,
              state : state, 
              country : country

            }
        

            let tempObj = {
              ...output,
              ...locationObject
            }

            resolve(tempObj);

          })
          .catch(console.error);
        }
        else{
          resolve(null);
        }
            
      
      });
    });
  
  }


  function getURL(storageRef, file) {
    return new Promise((resolve, reject) => {


      

      
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
          console.log('Upload is ' + progress + '% done');
          setUploadPercent(progress);
          setUploadFileName(file.name);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCurrentUpload(currentUpload => currentUpload + 1);
            console.log(currentUpload)

            console.log('File available at', downloadURL);
            resolve(downloadURL);
            
          });
        }
      );
    
    })
  }

  async function addPhotoAlbumData(src){

    if(!props.editingSettings.isAlbum && props.editingSettings.adding){


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
  

  }
 
 
  function addPhotoAlbum(){
    let fileInput = document.getElementsByClassName("fileInput")[0];
    const files = fileInput.files;

    if(!props.editingSettings.isAlbum && props.editingSettings.adding){
      let photoId = Date.now().toString();
      const storageRef = ref(storage, photoId);
      !props.loggedIn ? getBase64(files[0]).then( data => addPhotoAlbumData(data)) : getURL(storageRef, files[0]).then( data => addPhotoAlbumData(data));  
    }

    else if(props.editingSettings.isAlbum && props.editingSettings.adding){

      console.log(Array.from(files).length);

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


    
      async function asyncCall() {

        
      
        const filePathsPromises = [];
        const metaDataPromises = [];

        Array.from(files).forEach((file) => {


          
          

          let photoId = Date.now().toString();
          const storageRef = ref(storage, photoId);

          filePathsPromises.push(props.loggedIn ? getURL(storageRef, file) : getBase64(file));
          metaDataPromises.push(getMetaData(file));


     
        
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

        const filePaths = await Promise.all(filePathsPromises);
        const metaData = await Promise.all(metaDataPromises);

        tempAlbum.photos = filePaths.map((base64File, index) => (
          {
            ...tempAlbum.photos[index],
            img : base64File,
            
          }
        ));

        
        
        
        tempAlbum.photos = metaData.map((data, index) => (
          {
            ...tempAlbum.photos[index],
            date : (data !== null && data.DateTimeOriginal !== null) ? data.DateTimeOriginal.toDateString() : files[index].lastModifiedDate.toDateString(),
            location : (data !== null && data.country !== null) ? data.city + ", " + data.state + ", " + data.country : ""
            
          }
        ));

        
        
 

       
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
        




        setIsUploading(false);


        //call some sort of function that hides the editing component again and resets currentalbum state
        props.onEditExit();
      }

      asyncCall();
        
    

    }

  }


  function onInputChange(e){
      setInput( prevInput => {
        return { ...prevInput,  [e.target.name]: e.target.value}
      })
  }

 
  function removeTag(e){
    console.log(e.target.innerText);
    let tempTags = tags
    let index = tempTags.findIndex(tag => {return e.target.innerText === tag});
    tempTags.splice(index, 1); // 2nd parameter means remove one item only
    setTags((tempTags) => [...tempTags]);
  }


  //handles save functionality
  async function onClickSave(){

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));
    let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});


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
    else if(!props.editingSettings.isAlbum){

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

  //handles adding tag
  function onClickAddTag(){

  if(tags.includes(document.getElementsByClassName("tagInput")[0].value)){
    window.alert("Tag already added");
  }
  else if(tags.length >= 10){window.alert("Reached tag limit");} 
  else{
    let tempTags = tags
    tempTags.push(document.getElementsByClassName("tagInput")[0].value)
    setTags((tempTags) => [...tempTags]);
    document.getElementsByClassName("tagInput")[0].value = "";
  }
  }







  
  //--------------------------USE EFFECT-----------------------------//

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
            <button onClick={props.onEditExit} className='closeButton'>X</button>

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
                      placeholder = {props.isAlbum ? "from" : "date and time"}
                      name="fromDate"
                      id="fromDate"
                    />    
                          
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
                  placeholder= {props.isAlbum ? "What kinds of pictures are in this album?" : "What inspired you to take this photo?"}
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

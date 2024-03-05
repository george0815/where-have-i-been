import {React, useState, useEffect} from 'react'; //React
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Editing.css';
import '../styles/Navbar.css';



//login page
export default function Editing(props) {

  //---------------------------STATE--------------------------------//

  
  //sets up tag state
  const [tags, setTags] = useState( props.editingSettings.isAlbum ? props.currentAlbum.tags :  props.currentPhoto.tags); 


  //sets up album state
  const [input, setInput] = useState({}); 


  //--------------------------FUNCTIONS-----------------------------//

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  
  }

  function addPhotoAlbumData(src){

    if(!props.editingSettings.isAlbum && props.editingSettings.adding){


          //make new temp album object from localstorage albums object
          let tempAlbums = JSON.parse(localStorage.getItem("albums"));
          let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});

          //create temp photo object from input, and tempalbum
          let tempPhoto = {
            img : src,
            id :  Date.now(),
            caption : document.getElementById("caption").value,
            location : document.getElementById("location").value,
            date : document.getElementById("fromDate").value,
            description : document.getElementById("description").value,
            tags : tags
          }
      
          //replace data with data from inputs
          tempAlbums[index].photos.push(tempPhoto);
          
   
          //overwrite albums object in local storage
          localStorage.setItem('albums', JSON.stringify(tempAlbums));
          sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));

          //call some sort of function that hides the editing component again and resets currentalbum state
          props.onEditExit();

    }
  

  }

 
  function addPhotoAlbum(){
    let fileInput = document.getElementsByClassName("fileInput")[0];
    const files = fileInput.files;

    if(!props.editingSettings.isAlbum && props.editingSettings.adding){
      getBase64(files[0]).then( data => addPhotoAlbumData(data));  
    }

    else if(props.editingSettings.isAlbum && props.editingSettings.adding){

      //make new temp album object from localstorage albums object
      let tempAlbums = JSON.parse(localStorage.getItem("albums"));

      //add album data 
      let tempAlbum = {
        caption : document.getElementById("caption").value,
        location : document.getElementById("location").value,
        date : document.getElementById("fromDate").value,
        dateTo : document.getElementById("toDate").value,
        description : document.getElementById("description").value,
        tags : tags,
        img: "",
        id : Date.now(),
        photos : []
      }


      async function asyncCall() {

        const filePathsPromises = [];
        Array.from(files).forEach((file, index) => {
          filePathsPromises.push(getBase64(file));

          tempAlbum.photos.push(

            {
              id :  Date.now(),
              key: Date.now(),
              caption : index,
              location : "location",
              date : "date",
              description : "description",
              tags : []
            }

          );
        });
        const filePaths = await Promise.all(filePathsPromises);
        tempAlbum.photos = filePaths.map((base64File, index) => (
          {
            ...tempAlbum.photos[index],
            img : base64File,
            
          }
        ));
 

       
        console.log(tempAlbum.photos[0]);
        tempAlbum.img = tempAlbum.photos[0].img;

        //replace data with data from inputs
        tempAlbums.push(tempAlbum);
            
    
        //overwrite albums object in local storage
        localStorage.setItem('albums', JSON.stringify(tempAlbums));

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
    let tempTags = tags
    tempTags.splice(tempTags.findIndex(tag => {return e.target.value === tag}, 1)); // 2nd parameter means remove one item only
    setTags((tempTags) => [...tempTags]);
  }


  //handles save functionality
  function onClickSave(){

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));
    let index = tempAlbums.findIndex(album => {return JSON.parse(sessionStorage.getItem("currentAlbum")).id === album.id});


    if(props.editingSettings.isAlbum){
      
      //replace data with data from inputs
      tempAlbums[index].caption = document.getElementById("caption").value;
      tempAlbums[index].location = document.getElementById("location").value;
      tempAlbums[index].date = document.getElementById("fromDate").value;
      tempAlbums[index].dateTo = document.getElementById("toDate").value;
      tempAlbums[index].description = document.getElementById("description").value;
      tempAlbums[index].tags = tags;
   
      //overwrite albums object in local storage
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

    }
    else if(!props.editingSettings.isAlbum){

      let photoIndex = tempAlbums[index].photos.findIndex(photo => {return JSON.parse(sessionStorage.getItem("currentPhoto")).id === photo.id});


      //replace data with data from inputs
      tempAlbums[index].photos[photoIndex].caption = document.getElementById("caption").value;
      tempAlbums[index].photos[photoIndex].location = document.getElementById("location").value;
      tempAlbums[index].photos[photoIndex].date = document.getElementById("fromDate").value;
      tempAlbums[index].photos[photoIndex].description = document.getElementById("description").value;
      tempAlbums[index].photos[photoIndex].tags = tags;

      //overwrite albums object in local storage
      localStorage.setItem('albums', JSON.stringify(tempAlbums));

      //overwrite currentAlbum object
      sessionStorage.setItem("currentAlbum", JSON.stringify(tempAlbums[index]));


      //overwrite current photo object in session storage
      sessionStorage.setItem("currentPhoto", JSON.stringify(tempAlbums[index].photos[photoIndex]));

      //refresh
      props.setCurrentPhoto(tempAlbums[index].photos[photoIndex]);

    }

    //call some sort of function that hides the editing component again and resets currentalbum state
    props.onEditExit();


  }

  //handles adding tag
  function onClickAddTag(){
    let tempTags = tags
    tempTags.push(document.getElementsByClassName("tagInput")[0].value)
    setTags((tempTags) => [...tempTags]);
  }


  
  //--------------------------USE EFFECT-----------------------------//

  useEffect(() => {

    setInput(props.editingSettings.isAlbum ?
      {
        description: props.currentAlbum.description,
        location: props.currentAlbum.location,
        toDate: props.currentAlbum.dateTo,
        fromDate: props.currentAlbum.date,
        caption: props.currentAlbum.caption
      }
  
      :
  
      {
        description: props.currentPhoto.description,
        location: props.currentPhoto.location,
        fromDate: props.currentPhoto.date,
        caption: props.currentPhoto.caption
      }
    )

    setTags(props.editingSettings.isAlbum ? props.currentAlbum.tags :  props.currentPhoto.tags)

  }, [props.editingSettings])


  //------------------------JSX OBJECT------------------------------//


  return (

        //main div that hold all the login promps and buttons
        <div className="editingContainer">

            {/* Caption and Location*/}
            <div className='captionLocation'>
               {/* Caption*/}
              <div className='inputContainerEditing'>
                <label htmlFor="name">Caption</label>
                <input
                  type="text"
                  placeholder="caption"
                  name="caption"
                  id="caption"
                  value={input.caption}
                  onChange={onInputChange}

                />    
              </div>
               {/*Location*/}
              <div className='inputContainerEditing location' >
                <label htmlFor="location">Location</label>
                <input
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
                    <input
                      className='dateAndTime'
                      type="text"
                      placeholder = {props.isAlbum ? "from" : "date and time"}
                      name="fromDate"
                      id="fromDate"
                      value={input.fromDate}
                      onChange={onInputChange}

                    />    
                    
                    { props.editingSettings.isAlbum && <input
                      type="text"
                      placeholder="to"
                      name="toDate"
                      className='toDate'
                      id="toDate"
                      value={input.toDate}
                      onChange={onInputChange}
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
                      type="text"
                      placeholder="tag name"
                      name="tagInput"
                      className='tagInput'
                    />   
                    <button className='addTag' onClick={onClickAddTag}>Add tag</button>
                  </div>
 
                </div>   

              </div>   

              {/*Contains actual tags*/}
              <div className='tagsContainerEditing'> {tags.map((tag) => (<button onClick={(e) => {removeTag(e)}} key={tag} className='tag'> {tag}</button>))}</div>
            </div>     
               
            {/*Save Button*/}
            <button className='saveButton' onClick={!props.editingSettings.adding ? onClickSave : console.log("Add")}>
                {props.editingSettings.saveButtonText}
                {props.editingSettings.adding && <input onChange={addPhotoAlbum} className="fileInput" type="file" multiple />}
            </button>


        </div>
       
    

  );
}

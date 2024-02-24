import {React } from 'react'; //React
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Editing.css';
import '../styles/Navbar.css';



//login page
export default function Editing(props) {

  //handles save functionality
  function onClickSave(){

    //make new temp album object from localstorage albums object
    let tempAlbum = JSON.parse(localStorage.getItem("albums"));

    //cycle throught it and find album with Id that matches current album
    

    //replace only changed data

    //overwrite albums object in local storage

    //call some sort of function that hides the editing component again and resets currentalbum state

  }

  //handles adding tag
  function onClickAddTag(){

    //create state for tag from album prop
  
    //simply add tag

  }




  return (

        //main div that hold all the login promps and buttons
        <div className="editingContainer">

            {/* Caption and Location*/}
            <div className='captionLocation'>
               {/* Caption*/}
              <div className='inputContainerEditing'>
                <label for="caption">Caption</label>
                <input
                  type="text"
                  placeholder="caption"
                  name=
                  "caption"
                />    
              </div>
               {/*Location*/}
              <div className='inputContainerEditing location' >
                <label for="location">Location</label>
                <input
                  type="text"
                  placeholder="location"
                  name="location"
                />  
              </div>
            </div> 


            {/* Date and time*/}
            <div className='dateTime'>
      
                <div className='inputContainerEditing'>
                  <label for="dateAndTime">Date and Time</label>
                  <div className='dateInputContainer'>

                    {/*If the user is currently adding or editing an
                    album, a second input box is displayed so they can enter a range of dates*/}
                    <input
                      className='dateAndTime'
                      type="text"
                      placeholder = {props.isAlbum ? "from" : "date and time"}
                      name="dateAndTime"
                    />    
                    
                    { props.isAlbum && <input
                      type="text"
                      placeholder="to"
                      name="toDate"
                      className='toDate'
                    />  
                    } 
                  </div>
                </div>
            </div>     

            {/* Description */}
            <div className='description'>
              <div className='inputContainerEditing'>

                <label for="description">Description</label>
                <textarea
                  rows={6}
                  placeholder= {props.isAlbum ? "What kinds of pictures are in this album?" : "What inspired you to take this photo?"}
                  name="description"
                  className='descriptionInput'
                />   
              </div>  
            </div>  


            {/*Tags and button*/}
            <div className='tagsEditing'>

              {/*Contains the input and button to add a new tag*/}
              <div className='inputTagContainer'>

                <div className='inputContainerEditing'>

                  <label for="tagInput">Tags</label>
                  <div className='addTagRow'>
                    <input
                      type="text"
                      placeholder="tag name"
                      name="tagInput"
                      className='tagInput'
                    />   
                    <button className='addTag'>Add tag</button>
                  </div>

                </div>   

              </div>   

              {/*Contains actual tags*/}
              <div className='tagsContainerEditing'> </div>
            </div>     
               
            {/*Save Button*/}
            <button className='saveButton'>{props.saveButtonText}</button>


        </div>
       
    

  );
}

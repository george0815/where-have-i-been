import {React, useState } from 'react'; //React
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Editing.css';
import '../styles/Navbar.css';



//login page
export default function Editing(props) {


  //sets up tag state
  const [tags, setTags] = useState(props.currentAlbum.tags); 


  //sets up album state
  const [input, setInput] = useState(

    {
      description: props.currentAlbum.description,
      location: props.currentAlbum.location,
      toDate: props.currentAlbum.dateTo,
      fromDate: props.currentAlbum.date,
      caption: props.currentAlbum.caption
    }

  ); 

  function onInputChange(e){
      setInput( prevInput => {
        
        return {
          ...prevInput,
          [e.target.name]: e.target.value
        }

      })
    
  }

 
  function removeTag(e){

    let tempTags = tags

   tempTags.splice(tempTags.findIndex(tag => {return e.target.value === tag}, 1)); // 2nd parameter means remove one item only


    //simply add tag
    setTags((tempTags) => [...tempTags]);

  }


  //handles save functionality
  function onClickSave(){

    //make new temp album object from localstorage albums object
    let tempAlbums = JSON.parse(localStorage.getItem("albums"));

    //cycle throught it and find album with Id that matches current album
    tempAlbums.forEach((album) => {
    

      if(album.id === props.currentAlbum.id){
        //replace data with data from inputs
        album.caption = document.getElementById("caption").value;
        album.location = document.getElementById("location").value;
        album.date = document.getElementById("fromDate").value;
        album.dateTo = document.getElementById("toDate").value;
        album.description = document.getElementById("description").value;
      }
    
    });


    //overwrite albums object in local storage
    localStorage.setItem('albums', JSON.stringify(tempAlbums));




    //call some sort of function that hides the editing component again and resets currentalbum state
    props.onEditExit();


  }

  //handles adding tag
  function onClickAddTag(){
  
    let tempTags = tags
    tempTags.push(document.getElementsByClassName("tagInput")[0].value)

    //simply add tag
    setTags((tempTags) => [...tempTags]);
  }




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
                    
                    { props.isAlbum && <input
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
            <button className='saveButton' onClick={onClickSave}>
                {props.saveButtonText}
                {props.adding && <input className="fileInput" type="file" multiple />}
            </button>


        </div>
       
    

  );
}

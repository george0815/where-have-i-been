import {React } from 'react'; //React
//CSS
import '../styles/Mainpage.css';
import '../styles/Fonts.css';
import '../styles/Editing.css';
import '../styles/Navbar.css';



//login page
export default function Editing(props) {

  

  let isAlbum = props.isAlbum;


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
                      placeholder = {isAlbum ? "from" : "date and time"}
                      name="dateAndTime"
                    />    
                    
                    { isAlbum && <input
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
                  placeholder="What inspired you to take this photo?"
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
              <div className='tagsContainerEditing'> 
                <div className='tag'>Street</div>
                <div className='tag'>Dusk</div>
                <div className='tag'>Shops</div>
                <div className='tag'>Dusseldorf</div>
                <div className='tag'>Walk</div>
              </div>
            </div>     
               
            {/*Save Button*/}
            <button className='saveButton'>{props.saveButtonText}</button>


        </div>
       
    

  );
}

import {React} from 'react'; //React
import Background from './Background'; //Gets background
import germany from '../images/test/germany.jpg';
//CSS
import '../styles/Fonts.css';
import '../styles/Navbar.css';
import '../styles/Photo.css';
 


//Photo page
export default function Photo() {

 
  return (

      //Holds all elements in the photo page
      <div className="mainPhotoContainer">

        {/*left arrow*/}
        <button className='arrow'>↩</button>

        {/*Holds the photo, info, caption, and fullscreen button*/}
        <div className='photoContainer'>

            {/*Holds the photo and tool tip*/}
            <div className="photo"> 
                
                {/*holds all the text and tags that display when the user hovers over the photo*/}
                <div className='tooltiptext'>
                           
                    <p>I decided to get out of my hotel and go downtown for awhile, the sun was starting to set when I got there so I decided to take this photo in the middle of the street. Afterward I went to the bakery and got a strudel. By the time I went home it was almost dark and I saw a beautiful sunset.</p>
                    <nav className='tagContainer'>
                        <div className='tag'>Street</div>
                        <div className='tag'>Dusk</div>
                        <div className='tag'>Shops</div>
                        <div className='tag'>Dusseldorf</div>
                        <div className='tag'>Walk</div>
                    </nav>

                </div>
                {/*actual photo*/}
                <img src={germany}/> 
            </div>

            {/*Holds the caption, date and time, and fullscreen button*/}
            <div className='captionContainer'>
                <p className='caption'>Downtown at Dusk     <span className='dateline'>Düsseldorf, Germany - 5:30PM Sunday, 11/23/2022</span></p>
                <button className='fullscreenButton'>Fullscreen</button>
            </div>

        </div>
                
        {/*right arrow*/}
        <button className='arrow'>↪</button>

        {/*background*/}
        <Background isMain={false}/>
   

        
      </div>

  );
}
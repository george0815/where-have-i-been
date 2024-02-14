import { useState, useRef, useEffect, React } from 'react'; //React
import backgrounds from './backgrounds'; //Gets array of background photos
//CSS
import '../styles/Mainpage.css';
import '../styles/fonts.css';
import '../styles/Navbar.css';


//main page
export default function Mainpage() {

  const [currentSlide, setCurrentSlide] = useState(0) // set currrent slide index
  let sliderInterval = useRef() // interval ref


  useEffect(() => {

    // every 7 seconds will switch the background img to the next one in the array
    sliderInterval = setInterval(() => { setCurrentSlide((currentSlide + 1) % backgrounds.length); }, 7000);
    return () => {clearInterval(sliderInterval)}

  })


  return (

      //Holds all elements in the main page
      <div className="mainPageContainer">
        {/*Holds all the text in the main page, except for picture caption at the bottom left*/}
        <p className="mainTextContainer">A free, online photo album
            <br/>
                <span>Never lose your memories, <br/>save every experience</span>
            <br/><br/><br/><br/><br/><br/>
            <p>Login or <button>create an album as a guest</button></p>
        </p>
        {/*cycles through 4 images for the background pic by setting the classname*/}
        {backgrounds.map((image, index) => (
            <img
              id={index}
              key={index}
              className={index === currentSlide ? 'image active' : 'image'}
              src={image.src}
              style={{
                zIndex: `-${index+1}`
              }}
            />
          ))  }
        {/*caption for background*/}
        <p className="backgroundCaption">{backgrounds[currentSlide].name}</p>
      </div>

  );
}

import { useState, useRef, useEffect, React } from 'react'; //React
//imports images
import phuket from '../images/background/0.svg';
import newyork from '../images/background/1.svg';
import chicago from '../images/background/2.svg';
import kyoto from '../images/background/3.svg';
import '../styles/Background.css'; //CSS




//Array of objects that contain images of places and their names, used for the background of the main page
export const backgrounds = [
    {name : "Phuket, Thailand", src: phuket},
    {name : "Chicago, United States", src: chicago},
    {name : "New York, United States", src: newyork},
    {name : "Kyoto, Japan", src: kyoto}
]

export default function Background(props){


  const [currentSlide, setCurrentSlide] = useState(0); // set currrent slide index
  let sliderInterval = useRef() // interval ref

  //used for cycle the background image
  useEffect(() => {

    // every 7 seconds will switch the background img to the next one in the array
    sliderInterval = setInterval(() => { 
      setCurrentSlide((currentSlide + 1) % backgrounds.length);
      if(props.isMain){ props.setCurrentCaption(backgrounds[(currentSlide + 1)  % backgrounds.length].name)}}
      , 7000); 
    return () => {clearInterval(sliderInterval)}

  })

    return (
    //cycles through 4 images for the background pic by setting the classname
        backgrounds.map((image, index) => (
        <img
          id={index}
          key={index}
          className={index === currentSlide ? 'image active' : 'image'}
          src={image.src}
          style={{
            zIndex: `-${index+1}`
          }}
        /> 
       
    )) 
 
    
    )

}






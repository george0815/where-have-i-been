import './App.css';
import { useState, useEffect, React } from 'react'; //React
import { BrowserRouter, Route, Routes } from 'react-router-dom' //React Router
import { doc, getDoc } from "firebase/firestore"; 
import {db} from "./firebase"

//Components
import Mainpage from './components/Mainpage';
import Loginpage from './components/Loginpage';
import Albumspage from './components/Albumspage';
import Picturespage from './components/Picturespage';
import Photo from './components/Photo';
import Editing from './components/Editing';
import Signup from './components/Signup';
import ForgotPassword from './components/Forgotpassword';
import albumsObj from './components/Testalbums';



function App() {

  // sets albums state
  const [albums, setAlbums] = useState([]); 


  // sets albums state
  const [loggedIn, setLoggedIn] = useState(false); 


  async function getData(uid){
    const docRef = doc(db, "data", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        var arr_obj = Object.keys(docSnap.data()).map(key => (docSnap.data()[key]));
              
        //sets state
        setAlbums(arr_obj);

        //sets local storage
        localStorage.setItem('albums', JSON.stringify(arr_obj));

      }
  } 


  useEffect(() => {

    //sets loggedIn state
    if(JSON.parse(localStorage.getItem("user")) !== null){
      setLoggedIn(true);
      getData(JSON.parse(localStorage.getItem("user")).uid);
      
    }
    else if(JSON.parse(localStorage.getItem("albums")) !== null){
      //sets state
      setAlbums(JSON.parse(localStorage.getItem("albums")));
    }


   //localStorage.setItem('albums', JSON.stringify(albumsObj));
   //setAlbums(JSON.parse(localStorage.getItem("albums")));


  }, [loggedIn], [albums])

  return (
    <BrowserRouter>
      <Routes>
          {/*If user has albums, render albums page, if not, redner main page */}
          <Route path="/" element={(albums.length >= 1 || loggedIn) ? <Albumspage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/> : <Mainpage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/> }/>
          <Route path="main" element={<Mainpage setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="editing" element={<Editing setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="albums" element={<Albumspage setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="album" element={<Picturespage setAlbums={setAlbums} setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="photo" element={<Photo setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="login" element={<Loginpage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>
          <Route path="signup" element={<Signup setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="forgotPassword" element={<ForgotPassword setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>

      </Routes>
    </BrowserRouter>

  );
}

export default App;

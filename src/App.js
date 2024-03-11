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



function App() {

  // sets albums state
  const [albums, setAlbums] = useState(null); 


  // sets albums state
  const [loggedIn, setLoggedIn] = useState(false); 


  async function getData(uid){
    const docRef = doc(db, "data", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {



        var arr_obj = Object.keys(docSnap.data()).map(key => (docSnap.data()[key]));


        console.log(arr_obj);
        
        //sets state
        setAlbums(arr_obj);


        localStorage.setItem('albums', JSON.stringify(arr_obj));
        console.log(arr_obj);

      }
  } 


  useEffect(() => {

    //sets loggedIn state
    if(JSON.parse(localStorage.getItem("user")) !== null){
      setLoggedIn(true);
      console.log(JSON.parse(localStorage.getItem("user")));
      getData(JSON.parse(localStorage.getItem("user")).uid);
      
    }
    else if(JSON.parse(localStorage.getItem("albums")) !== null){
      //sets state
      setAlbums(JSON.parse(localStorage.getItem("albums")));
    }


  }, [loggedIn])

  return (
    <BrowserRouter>
      <Routes>
          {/*If user has albums, render albums page, if not, redner main page */}
          <Route path="/" element={(albums) ? <Albumspage setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/> : <Mainpage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/> }/>
          <Route path="main" element={<Mainpage setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="editing" element={<Editing setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="albums" element={<Albumspage setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="album" element={<Picturespage  setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="photo" element={<Photo setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="login" element={<Loginpage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>
          <Route path="signup" element={<Signup setLoggedIn={setLoggedIn}  loggedIn={loggedIn}/>}/>
          <Route path="forgotPassword" element={<ForgotPassword setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>

      </Routes>
    </BrowserRouter>

  );
}

export default App;

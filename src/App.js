import './App.css';
import { useState, useEffect, React } from 'react'; //React
import { BrowserRouter, Route, Routes } from 'react-router-dom' //React Router
//Components
import Mainpage from './components/Mainpage';
import Loginpage from './components/Loginpage';
import Albumspage from './components/Albumspage';
import Picturespage from './components/Picturespage';
import Photo from './components/Photo';
import Editing from './components/Editing';
import albumsObj from './components/Testalbums'; //gets test data



function App() {

  // sets albums state
  const [albums, setAlbums] = useState([]); 


  // sets albums state
  const [loggedIn, setLoggedIn] = useState(false); 


  useEffect(() => {

    //sets loggedIn state
    if(JSON.parse(localStorage.getItem("user")) !== null){
      setLoggedIn(true);
      console.log(JSON.parse(localStorage.getItem("user")));
    }
    console.log(loggedIn)


    //sets state
    setAlbums(JSON.parse(localStorage.getItem("albums")));
  }, [loggedIn])

  return (
    <BrowserRouter>
      <Routes>
          {/*If user has albums, render albums page, if not, redner main page */}
          <Route path="/" element={(albums.length > 0) ? <Albumspage loggedIn={loggedIn}/> : <Mainpage loggedIn={loggedIn}/> }/>
          <Route path="main" element={<Mainpage loggedIn={loggedIn}/>}/>
          <Route path="editing" element={<Editing loggedIn={loggedIn}/>}/>
          <Route path="albums" element={<Albumspage loggedIn={loggedIn}/>}/>
          <Route path="album" element={<Picturespage loggedIn={loggedIn}/>}/>
          <Route path="photo" element={<Photo loggedIn={loggedIn}/>}/>
          <Route path="login" element={<Loginpage setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>}/>

      </Routes>
    </BrowserRouter>

  );
}

export default App;

import './App.css';
import { useState, useEffect, React } from 'react'; //React
import { BrowserRouter, Route, Routes } from 'react-router-dom' //React Router
//Components
import Navbar from './components/Navbar';
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


  useEffect(() => {
    //pushes test datalocal to storage
    localStorage.setItem('albums', JSON.stringify(albumsObj));

    //sets state
    setAlbums(JSON.parse(localStorage.getItem("albums")));
  }, [])

  return (
    <BrowserRouter>
      <Routes>
          {/*If user has albums, render albums page, if not, redner main page */}
          <Route path="/" element={(albums.length > 0) ? <Albumspage albums={albums}/> : <Mainpage/> }/>
          <Route path="main" element={<Mainpage/>}/>
          <Route path="editing" element={<Editing/>}/>
          <Route path="albums" element={<Albumspage/>}/>
          <Route path="album" element={<Picturespage/>}/>
          <Route path="photo" element={<Photo/>}/>
          <Route path="login" element={<Loginpage/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

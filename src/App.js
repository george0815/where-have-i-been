import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar';
import Mainpage from './components/Mainpage';
import Loginpage from './components/Loginpage';
import Albumspage from './components/Albumspage';
import Picturespage from './components/Picturespage';
import Photo from './components/Photo';
import Editing from './components/Editing';


function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path="/" element={<Mainpage/>}/>
          <Route path="album" element={<Picturespage/>}/>
          <Route path="photo" element={<Photo/>}/>
          <Route path="login" element={<Loginpage/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;

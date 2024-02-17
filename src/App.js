import './App.css';
import React from 'react';import Navbar from './components/Navbar';

//import Mainpage from './components/Mainpage';
//import Loginpage from './components/Loginpage';
//import Albumspage from './components/Albumspage';
//import Picturespage from './components/Picturespage';
import Photo from './components/Photo';






function App() {
  return (
    <div className="App">
      <Navbar/>
      <Photo/>
    </div>
  );
}

export default App;

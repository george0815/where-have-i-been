import './App.css';
import React from 'react';import Navbar from './components/Navbar';

//import Mainpage from './components/Mainpage';
//import Loginpage from './components/Loginpage';
import Albumspage from './components/Albumspage';




function App() {
  return (
    <div className="App">
      <Navbar/>
      <Albumspage/>
    </div>
  );
}

export default App;

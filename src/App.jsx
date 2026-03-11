import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import {Plus , ArrowUp, LoaderCircle} from 'lucide-react';
import Hero from './components/Hero';
import OcrPage from './components/OcrPage';
import { Route, Routes } from 'react-router-dom';


function App() {
  return(
    <div>
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/ocr' element={<OcrPage/>}/>
    </Routes>
    </div>
  )
}

export default App

import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home'
import Tvshow from './Tvshow'
import People from './People'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
         <Route path='/Tvshow' element={<Tvshow/>}></Route>
         <Route path='/People' element={<People/>}></Route>  
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App



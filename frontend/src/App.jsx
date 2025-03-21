import React, { createContext, useContext, useState } from 'react'
import { Router, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './components/Login'
import Signup from './components/Signup'
import Protect from './components/Protect'
import Chat from './components/Chat'
export const chatcontext = createContext()
function App() {
  const [currentchat, setcurrentchat] = useState(null)

  return (
    <>
      <chatcontext.Provider value={{ currentchat, setcurrentchat }}>
        <Nav></Nav>
        <div className=" sm:ml-72 h-[100vh]">
          <Routes>
            <Route path="/chat" element={<Protect><Chat></Chat></Protect>}></Route>
            <Route path="/" index element={<Protect></Protect>}></Route>
            <Route path="/login" index element={<Protect><Login></Login></Protect>}></Route>
            <Route path="/signup" element={<Signup></Signup>}></Route>
          </Routes>
        </div>
      </chatcontext.Provider>
    </>
  )
}

export default App
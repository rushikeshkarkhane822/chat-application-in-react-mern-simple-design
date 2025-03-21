import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuthContext } from './context/UserAutth'
function Protect({children}) {
    const navigate = useNavigate()
    const { login } = useContext(UserAuthContext)
    useEffect(() => {
        const fetchuserdata = async ()=>{
                const checklogin = await axios.post('http://localhost:3001/checklogin',{},{withCredentials:true})
                if(checklogin.status == 201){
                    navigate('/login')
                }else{
                    login(checklogin.data)
                    navigate('/chat')
                }
        }
        fetchuserdata()
    }, [])
  return (
    <>
        {children}
    </>
  )
}

export default Protect
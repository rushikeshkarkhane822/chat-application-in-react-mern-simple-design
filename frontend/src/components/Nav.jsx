import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserAuthContext } from './context/UserAutth'
import axios from 'axios'
import { chatcontext } from '../App'
import Chats from './Chats'
function Nav() {
    const [serinp, setserinp] = useState(null)
    const { userdata } = useContext(UserAuthContext)
    const [serdata, setserdata] = useState('n')
    const [dark, setdark] = useState(true)
    const [chats, setchats] = useState({})
    const { currentchat, setcurrentchat } = useContext(chatcontext)
    const handlesearch = async () => {
        try {
            const finduser = await axios.post('http://localhost:3001/addchat', { email: serinp }, { withCredentials: true })
            if (finduser.length <= 0) {
                setserdata(null)
            } else {
                setserdata(finduser.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const clear = async () => {
        setserdata('n')
        setcurrentchat(null)
    }
    const toggledark = () => {
        document.getElementsByTagName("html")[0].classList.toggle("dark")
        setdark(!dark)
    }
    const getchats = async () => {
        try {
            const getc = await axios.post('http://localhost:3001/getchats', {}, { withCredentials: true })
            if (getc) {
                const setdatach = await setchats(getc.data)
                if (setdatach) {
                    console.log(chats)
                }
            } else {

            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {


        document.getElementsByTagName("html")[0].classList.add("dark")
    }, [])


    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-slate-500 rounded-lg sm:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:ring-slate-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <a to="https://flowbite.com" className="flex ms-2 md:me-24">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Chat Rapidex</span>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" onChange={toggledark} checked={dark} class="sr-only peer" />
                                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                            <div>
                                <div className="flex items-center ms-3">
                                    <button type="button" className="flex text-sm bg-slate-800 rounded-full focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        {userdata &&
                                            <img className=" w-10 h-10 rounded-full" src={'http://localhost:3001/uploads/' + userdata.filename} alt="user photo" />
                                        }
                                    </button>
                                    <p className="ml-2 w-min">{userdata?.name}</p>
                                </div>
                                <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-slate-100 rounded shadow dark:bg-slate-700 dark:divide-slate-600" id="dropdown-user">
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-slate-900 dark:text-white" role="none">
                                            Neil Sims
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-300" role="none">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <a to="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                                        </li>
                                        <li>
                                            <a to="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white" role="menuitem">Settings</a>
                                        </li>
                                        <li>
                                            <a to="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white" role="menuitem">Earnings</a>
                                        </li>
                                        <li>
                                            <a to="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-72 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-slate-200 sm:translate-x-0 dark:bg-slate-800 dark:border-slate-700" aria-label="Sidebar">
                <div className="h-full pb-4 overflow-y-auto bg-white dark:bg-slate-800">
                    <ul className="space-y-2 font-medium">


                        {userdata == null ?
                            <>
                                <li>
                                    <Link to="/login" className="flex items-center p-2 text-slate-900 rounded-lg dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group">
                                        <svg className="flex-shrink-0 w-5 h-5 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                            <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                            <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Login</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="flex items-center p-2 text-slate-900 rounded-lg dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 group">
                                        <svg className="flex-shrink-0 w-5 h-5 text-slate-500 transition duration-75 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                                    </Link>
                                </li>
                            </> : (<>
                                <form class="max-w-md mx-auto px-3" onSubmit={(e) => e.preventDefault()}>
                                    <label for="default-search" class="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-white">Add</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                            </svg>
                                        </div>
                                        <input type="text" onChange={(e) => { setserinp(e.target.value) }} id="default-search" class="block w-full p-4 ps-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name Or Phone" required />
                                        {serdata == 'n' ? (
                                            <button type="submit" onClick={handlesearch} class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>

                                        ) : (
                                            <button onClick={clear} class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">X</button>

                                        )}
                                    </div>
                                </form>

                                <Chats></Chats>
                                { serdata != 'n' && (serdata == null ? (
                                    <>
                                        <div id="seri">
                                            <div className="flex m-3 items-center border border-1 dark:border-slate-700 p-2 rounded-md">
                                                <p>No Such User Found</p>
                                            </div>
                                        </div>

                                    </>
                                )
                                    :  serdata.map((userda)=>(
                                        <>

                                            <div id="seri">
                                                <div className="flex m-3 items-center border border-1 dark:border-slate-700 p-2 rounded-md">
                                                    <img
                                                        src={'http://localhost:3001/uploads/' + userda.filename}
                                                        className="rounded-[50%] w-8 h-8 mx-2"
                                                        alt=""
                                                    />
                                                    <div className="flex flex-col justify-start items-start">
                                                        <p>{userda?.name}</p>
                                                        <button className="dark:bg-slate-750 rounded-md p-2 text-sm " onClick={() => setcurrentchat(userda)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>


                                    )))}
                            </>)
                        }
                    </ul>
                </div>
            </aside>


        </>
    )
}

export default Nav
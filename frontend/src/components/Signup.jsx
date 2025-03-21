import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
function Signup() {

    const { handleSubmit, register, formState: { errors } } = useForm()
   const onsubmit = async (data)=>{
    try {
        const formdata = new FormData()
        formdata.append('name',data.name)
        formdata.append('photo',data.photo[0])
        formdata.append('email',data.email)
        formdata.append('phone',data.phone)
        formdata.append('password',data.password)
        formdata.append('cpassword',data.cpassword)
        const post = await axios.post('http://localhost:3001/register',formdata)
        if(post){
            alert(post.data)
        }
    } catch (error) {
        console.log(error)
    }
   }
    return (
        <>
            <div className="flex flex-col items-center justify-center pt-28 h-full">
                <div className="dark:bg-slate-750 w-[30rem] h-min rounded-2xl flex flex-col justify-center">
                    <form className="p-4 font-bold text-2xl" onSubmit={handleSubmit(onsubmit)} encType='multipart/form-data'>
                        <h1 className=' text-center pb-2'>Signup</h1>
                        <div className="mb-5">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                            <input
                                {...register('name', { required: 'name is required' })}
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Name"
                            />
                            {errors.name && <p className='text-red-800'>Name Is Required</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="profile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Photo</label>
                            <input
                                {...register('photo',{ required: 'photo is required' })}
                                type="file"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {errors.photo && <p className='text-red-800'>Photo Is Required</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                            <input
                                {...register('email',{ required: 'email is required' })}
                                type="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@gmail.com"
                            />
                            {errors.email && <p className='text-red-800'>email Is Required</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone</label>
                            <input
                                {...register('phone',{ required: 'phone is required' })}
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="9XXXXXXXXX9"
                            />
                            {errors.phone && <p className='text-red-800'>phone Is Required</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
                            <input
                                {...register('password', { required: 'password is required' })}
                                type="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {errors.password && <p className='text-red-800'>password Is Required</p>}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Your Password</label>
                            <input
                                type="password"
                                {...register('cpassword', { required: 'cpassword is required' })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {errors.cpassword && <p className='text-red-800'>cpassword Is Required</p>}
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup

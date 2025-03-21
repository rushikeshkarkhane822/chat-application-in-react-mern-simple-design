import axios from 'axios'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { UserAuthContext } from './context/UserAutth'
import { useNavigate } from 'react-router-dom'
function Login() {
  const { handleSubmit, register, formState: { errors } } = useForm()
  const { login } = useContext(UserAuthContext)
  const navigate = useNavigate()
  const onLogin = async (data) => {
    const postdata = await axios.post('http://localhost:3001/login', { email: data.email, password: data.password }, { withCredentials: true })
    //  alert(postdata.data.message)
    if (postdata.data.message == 'login sucess') {
      alert(postdata.data.message)
      login(postdata.data.user)
      navigate('/chat')

    } else {
      console.log(postdata.data)
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="dark:bg-slate-750 w-[30rem] h-[20rem] rounded-2xl flex flex-col justify-center">
          <form className="p-4 font-bold text-2xl" onSubmit={handleSubmit(onLogin)}>
            <h1 className=' text-center pb-2'>Login</h1>
            <div className="mb-5">
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="email" {...register('email', { required: 'email is required' })} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
              {errors.email && <p className='text-red-800'>Email is required</p>}
            </div>
            <div className="mb-5">
              <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
              <input type="password" {...register('password', { required: 'password is required' })} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              {errors.password && <p className='text-red-800'>Password is required</p>}
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>

        </div>
      </div>
    </>
  )
}

export default Login
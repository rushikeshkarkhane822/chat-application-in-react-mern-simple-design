import React, { Children, createContext, useContext, useState } from 'react'
export const UserAuthContext = createContext()
function UserAutth({children}) {
  const [userdata, setuserdata] = useState(null)
  const login = (user) => setuserdata(user)
  const logout = (user) => setuserdata(null)
  return (
    <UserAuthContext.Provider value={{userdata,login,logout}}>
        {children}
    </UserAuthContext.Provider>
  )
}

export default UserAutth
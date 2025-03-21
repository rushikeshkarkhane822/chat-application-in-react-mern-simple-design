import React, { useContext, useEffect, useState } from 'react';
import { chatcontext } from '../App';
function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); 
    const { currentchat, setcurrentchat } = useContext(chatcontext)

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/getchats', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    eventSource.onmessage = function (event) {
      const newChat = JSON.parse(event.data);
      console.log(newChat);
      setChats((prevChats) => {
        if (!prevChats.some(chat => chat.email === newChat.email)) {
          return [...prevChats, newChat];
        }
        return prevChats;
      });
      setLoading(false);
    };

    eventSource.onerror = function (error) {
      console.error('Error in SSE connection', error);
      eventSource.close();
      setLoading(false);  
    };


    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      {!loading && chats.length === 0 && (
        <div className="text-center text-gray-500">
          No chats available.
        </div>
      )}

      <div className="space-y-4">
        {!loading && chats.map((userda, index) => (
          <div key={index} className="flex m-3 items-center border border-1 dark:border-slate-700 p-2 rounded-md"onClick={(e)=>{setcurrentchat(userda)}}>
            <img
              src={`http://localhost:3001/uploads/${userda.filename}`}
              className="rounded-[50%] w-8 h-8 mx-2"
              alt=""
            />
            <div className="flex flex-col justify-start items-start">
              <p className=" select-none">{userda.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Chats;

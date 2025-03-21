import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { chatcontext } from '../App';

function Chat() {
  const { currentchat } = useContext(chatcontext);
  const [chatinp, setchatinp] = useState('');
  const [messages, setmessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getchat = async () => {
    try {
      setLoading(true);
      const getmessages = await axios.post('http://localhost:3001/getmessages', { usermail: currentchat.email }, { withCredentials: true });
      if (getmessages) {
        setmessages(getmessages.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const publishmessage = async () => {
    try {
      setLoading(true);
      const postm = await axios.post('http://localhost:3001/publishmessage', { message: chatinp, usermail: currentchat.email }, { withCredentials: true });
      if (postm) {
        setchatinp('');
        setLoading(false);
      } else {
        console.log('error');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentchat) return; // Prevent fetching if currentchat is null or undefined
    setmessages([]);
    setLoading(true);

    const eventSource = new EventSource(`http://localhost:3001/getmessages/users/${currentchat.email}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    eventSource.onmessage = function (event) {
      const newMessage = JSON.parse(event.data);
      setmessages((prevMessages) => {
        const isDuplicate = prevMessages.some(msg => msg.message === newMessage.message);
        if (!isDuplicate) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
      setLoading(false);
    };

    eventSource.onerror = function (error) {
      console.error('Error in SSE connection', error);
      eventSource.close();
      setLoading(false);
    };

    getchat(); // Fetch initial messages when current chat changes

    return () => {
      eventSource.close();
    };
  }, [currentchat]);

  return (
    <>
      {currentchat == null ? (
        <div className="flex justify-center items-center h-[100vh]">
          <h1 className="text-5xl font-extrabold w-min">Welcome To <span className="text-blue-700">ChatRapidex</span></h1>
        </div>
      ) : (
        <div className="containerchat flex flex-col h-full" style={{ paddingTop: 'calc(48px + .75rem)' }}>
          <div className="flex p-3 mt-3 items-center dark:bg-slate-750 overflow-hidden bg-slate-150">
            <img className="h-12 w-12 rounded-[50%]" src={`http://localhost:3001/uploads/${currentchat.filename}`} alt="profile" />
            <p className="font-bold text-2xl p-3">{currentchat.name}</p>
          </div>
          <div className="chats flex flex-col-reverse flex-grow overflow-y-auto no-scrollbar">
            <div className="text-1xl m-3">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
                  <span className="ml-2 text-gray-500">Loading messages...</span>
                </div>
              ) : (
                messages.length > 0 ? messages.map((ms) => (
                  <div
                    key={ms._id}
                    className={`message ${ms.sender === currentchat.email ? 'sent' : 'received'}`}
                    style={{
                      display: 'flex',
                      justifyContent: ms.sender === currentchat.email ? 'flex-start' : 'flex-end',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      className={`message-box ${ms.sender === currentchat.email ? 'sent-box dark:bg-slate-850 bg-slate-100 p-3 rounded-lg scroll-auto' : 'received-box dark:bg-slate-750 bg-slate-200 p-3 rounded-lg'} `}
                    >
                      <p>{ms.message}</p>
                    </div>
                  </div>
                )) : <>
                </>
              )}
            </div>
          </div>

          <div className="p-3 dark:bg-slate-750 bg-slate-150 mt-auto">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <div className="relative w-full mx">
                  <input
                    type="text"
                    onChange={(e) => setchatinp(e.target.value)}
                    value={chatinp}
                    className="outline-none block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-4 border-gray-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-slate-500"
                    placeholder="Enter Your Message"
                    required
                  />
                  <button
                    type="submit"
                    onClick={publishmessage}
                    className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-slate-300 rounded-r-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12 h-4 w-4">
                      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                    <span className="sr-only">Send Message</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;

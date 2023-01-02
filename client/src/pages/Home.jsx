import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()

    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")

    function handleEnterKeyPress(e) {
        if (e.code === 'Enter') joinRoom() 
    }

    function createNewRoom(e) {
        e.preventDefault()

        const id = uuidv4()
        setRoomId(id)

        toast.success('Created a New Room')
    }

    function joinRoom() {
        if (!roomId || !username) {
            toast.error('Room ID and Username is required')
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username
            }
        })
    }

    return (
        <div className='w-full h-screen bg-dark sm:px-6 pt-4 text-white flex items-center justify-center flex-col'>
            <div className='bg-mid p-6 rounded-md w-11/12 sm:w-2/5 mb-8'>
                <div className='flex items-center'>
                    <img
                        className='w-12 sm:w-20'
                        src="/images/logo.png"
                        alt="logo" />
                    <div className='border-l-2 sm:border-l-4 border-l-solid border-l-white pl-2'>
                        <h1 className='font-black text-lg sm:text-2xl'>CodeFlix</h1>
                        <h4 className='text-green text-xs sm:text-sm font-semibold'>Realtime Collaboration</h4>
                    </div>
                </div>
                <h4 className='sm:mt-0 mt-1 mb-6 sm:mb-4 font-semibold'>Paste Invitation RoomID</h4>
                <div className="flex flex-col">
                    <input
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleEnterKeyPress}
                        value={roomId}
                        placeholder='ROOM ID'
                        className='px-2 py-1 rounded-sm outline-none mb-4 font-bold text-black bg-[#eee]'
                        type="text" />
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleEnterKeyPress}
                        value={username}
                        placeholder='USERNAME'
                        className='px-2 py-1 rounded-sm outline-none mb-4 font-bold text-black bg-[#eee]'
                        type="text" />
                    <button
                        onClick={joinRoom}
                        className='bg-green text-black py-2 w-32 sm:w-40 ml-auto font-bold hover:bg-green-dark transition-all hover:text-white rounded-sm'>
                        Join
                    </button>
                    <p className="mt-6 text-center sm:text-base text-xs">
                        If you don't have an invite then &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className='text-green hover:text-green-dark'>
                            Create New Room
                        </a>
                    </p>
                </div>
            </div>

            <footer className='fixed bottom-0 left-0 w-full bg-mid py-2'>
                <h4 className='flex items-center justify-center text-sm'>
                    Built with
                    <img
                        className='w-4 mx-1'
                        src="/images/heart.png"
                        alt="love" />
                    by
                    <a
                        className='text-green'
                        href="https://github.com/amanweb09">
                        &nbsp;Aman Khanna
                    </a>
                </h4>
            </footer>
        </div>
    )
}

export default Home
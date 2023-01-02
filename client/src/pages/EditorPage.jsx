import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../actions'
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {ClipboardDocumentIcon, PowerIcon} from '@heroicons/react/24/outline'

const EditorPage = () => {

  const { roomId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [clients, setClients] = useState([])

  const socketRef = useRef(null)
  const codeRef = useRef(null)

  useEffect(() => {

    function handleErrors(err) {
      console.log('socket error', err);
      toast.error('socket connection failed, try again')
    }

    async function init() {
      socketRef.current = await initSocket()

      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username //sent from homepage through react router
      })

      //listening join event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          //don't notify me
          toast.success(`${username} joined the room`)
        }

        setClients(clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        })
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`)
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId)
        })
      })
    }

    init()

    return () => {
      //cleanup 
      socketRef.current.disconnect()
      socketRef.current.off(ACTIONS.JOINED)   //unsubscribing socket event
      socketRef.current.off(ACTIONS.DISCONNECTED)   //unsubscribing socket event
    }
  }, [])

  async function copyRoomId() {
    try {
      await navigator.clipboard?.writeText(roomId)
      toast.success('Room ID copied to your clipboard')
    } catch (error) {
      console.log(error);
      toast.error("Couldn't copy Room ID")
    }
  }

  function leaveRoom() {
    navigate('/')
  }

  if (!location.state) {
    return <Navigate to={'/'} />
  }

  return (
    <div className='w-full min-h-screen bg-dark text-white flex'>

      <div className="w-1/5 bg-mid flex flex-col px-2">
        <div className='flex-1'>

          {/* logo */}
          <div className='flex items-center border-b-2 py-4 border-b-solid border-b-slate-600'>
            <img
              className='w-10 sm:w-16'
              src="/images/logo.png"
              alt="logo" />
            <div className='border-l-4 border-l-solid border-l-white pl-2'>
              <h1 className='sm:block hidden font-black text-xl'>CodeFlix</h1>
              <h4 className='sm:block hidden text-green text-xs font-semibold'>Realtime Collaboration</h4>
            </div>
          </div>

          <h3 className='mt-8 sm:block hidden font-bold'>Connected</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3">
            {
              clients.length > 0 &&
              clients.map((client) => <Client {...client} key={client.socketId} />)
            }
          </div>

        </div>

        <button
          onClick={copyRoomId}
          className='py-2 text-black flex-center rounded-sm bg-slate-100'>
            <span className='hidden sm:block'>Copy Room ID</span>
            <ClipboardDocumentIcon className='sm:hidden block w-6 h-6' />

        </button>
        <button
          onClick={leaveRoom}
          className='bg-green py-2 flex-center rounded-sm hover:bg-green-dark hover:text-white transition-all text-black my-2 font-bold'>
        <span className='hidden sm:block'>Leave</span>
            <PowerIcon className='sm:hidden block w-6 h-6' />
        </button>
      </div>

      <div className="flex-1">
        <Editor
          onCodeChange={(code) => codeRef.current = code}
          roomId={roomId}
          socketRef={socketRef} />
      </div>
    </div>
  )
}

export default EditorPage
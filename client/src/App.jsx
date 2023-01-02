import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import Home from './pages/Home'

function App() {

  return (
    <>
      <div>
        <Toaster 
        toastOptions={{
          success: {
            theme: {
              primary: '#4aee88'
            }
          }
        }}
        position='top-right' />
      </div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/editor/:roomId' element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import ImageGenerator from './core/components/ImageGenerator/ImageGenerator'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <ImageGenerator/>
   
   </>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BubblePlot } from './BubblePlot.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="graphic">
        <h1 style={{ fontSize: '30px', marginBottom: '5px' }}>GDP per Capita vs. Life Expectancy</h1>
        <BubblePlot />
        <p style={{ fontSize: '12px', color: 'gray', marginLeft: '25px'}}>Data source: Gapminder</p>

      </div>
      
    </>
  )
}

export default App

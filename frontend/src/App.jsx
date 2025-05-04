import React from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-[#0B101B] font-inter p-5 text-white">
      <div className="bg-[url('/assets/Swirl.svg')] bg-cover bg-no-repeat min-h-screen min-w-full">
        <Header />
        <Home/>

        <Footer/>
      </div>
    </div>
  )
}

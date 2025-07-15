import React from 'react'
import Hero from '../Hero'
import Introduction from '../Introduction'
import VideoOverlay from '../Trailer'
import ProductCards from '../ProductCard'

// ✅ Toastify importu
import { toast } from 'react-toastify'

const Home = () => {
  const handleClick = () => {
    toast.success("Toastify uğurla işləyir! 🎉", {
      position: "top-right",
    });
  };

  return (
    <>
      <Hero />
      <Introduction />
      <VideoOverlay />
      <ProductCards />

  

      {/* ✅ Test düyməsi */}
    
    </>
  )
}

export default Home

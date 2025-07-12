import React from 'react'
import Hero from '../Hero'
import Introduction from '../Introduction'
import VideoOverlay from '../Trailer'
import ProductCards from '../ProductCard'

const Home = () => {
  return (
   <>
   <Hero/>
      <Introduction/>
      <VideoOverlay/>
    
      <ProductCards/>
   </>
  )
}

export default Home
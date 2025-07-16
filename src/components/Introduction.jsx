import React from 'react'
import { Link } from 'react-router-dom';

const Introduction = () => {
  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Kart 1 */}
      <div className="relative group overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <img 
          src="/card1.jpg" 
          alt="Card 1" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end pb-10 justify-center">
          <div className="text-center px-4">
            {/* Başlıklar */}
            <h2 className="text-white text-3xl playfair-display font-bold">Böyük Fürsətlər</h2>
            <h1 className="text-white paraqraf font-bold py-3">Əla Qiymətlərə Əla Hədiyyələr</h1>
            
            {/* Buton - Hover'da hareket etmiyor, her zaman görünür */}
            <Link to={"/brands"}><button className="bg-blue-700 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-800 transition duration-300">
              Endirimli Məhsullarla Alış-veriş et
            </button></Link>
          </div>
        </div>
        {/* Lüks çerçeve efekti */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Kart 2 */}
      <div className="relative group overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
        <img 
          src="/card2.jpg" 
          alt="Card 2" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end pb-10 justify-center">
          <div className="text-center px-4">
            {/* Başlıklar */}
            <h1 className="text-white paraqraf paraqrafs tracking-widest">Xususi Arxitektura</h1>
            <h2 className="text-white text-3xl py-3 playfair-display font-bold">30 Faizə Qədər Endirimlər</h2>
            
            {/* Buton - Hover'da hareket etmiyor, her zaman görünür */}
             <Link to={"/brands"}><button className="bg-blue-700 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-800 transition duration-300">
              Endirimli Məhsullarla Alış-veriş et
            </button></Link>
          </div>
        </div>
        {/* Lüks çerçeve efekti */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300 pointer-events-none"></div>
      </div>

    </div>
  )
}

export default Introduction
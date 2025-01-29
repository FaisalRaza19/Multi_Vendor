import React from 'react'
import Hero from "./Home Pages/Hero.jsx";
import Categories from "./Home Pages/Categories.jsx";
import BestProducts from "./Home Pages/BestProducts.jsx";
import Sponsored from "./Home Pages/Sponsored.jsx"


const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <BestProducts />
      <Sponsored />
    </>
  )
}

export default Home

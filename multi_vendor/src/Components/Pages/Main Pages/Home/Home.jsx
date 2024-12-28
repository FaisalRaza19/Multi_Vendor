import React from 'react'
import Hero from './Hero.jsx';
import Categories from './Categories.jsx';
import BestDeals from "./BestDeals.jsx"
import PopularProduct from './PopularProducts.jsx';
import Sponsored from "./sponsored.jsx"


const Home = () => {
    return (
        <>
            <Hero />
            <Categories />
            <BestDeals />
            <PopularProduct />
            <Sponsored/>
        </>
    )
}

export default Home

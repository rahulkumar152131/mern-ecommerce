import React from 'react'
import "./style.scss";
import Navbar from '../../components/header/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Products from './products/Products';
import Filter from './filter/Filter';
const Home = () => {
    return (
        <div>
            <Filter />
            <Products />

        </div>
    )
}

export default Home
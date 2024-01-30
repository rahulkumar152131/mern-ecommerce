import React, { useEffect, useState } from 'react'

import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { getInitialAsync, productSelector, prodActions, likeProductAsync } from '../../../redux/reducer/productsReducer';
import { cartSelector, saveToCartAsync } from '../../../redux/reducer/cartReducer';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../../redux/reducer/userReducer';
import { FaThumbsUp } from "react-icons/fa";
import altproductImage from '../../../img/product.jpeg'

const Products = () => {
    let { products } = useSelector(productSelector);

    const carts = useSelector(cartSelector);
    const { user } = useSelector(userSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // console.log(user);
    useEffect(() => {
        dispatch(getInitialAsync());
    }, [dispatch])
    const addToCart = (product) => {
        if (user) {
            const alreadyinCart = carts?.some((cart) => cart?.productID?.toString() === product?._id?.toString());
            if (!alreadyinCart) {
                dispatch(saveToCartAsync(product));
            } else {
                console.log("already in Cart");
            }
        } else {
            navigate('/sign-in');
        }
    }
    products = products?.map((product) => {
        let averageRatings = 0;
        if (product?.ratings && product?.ratings?.length > 0) {
            const sum = product?.ratings?.reduce((acc, rate) => acc + rate?.rating, 0);
            averageRatings = (sum / product?.ratings?.length).toFixed(1);
        }

        if (carts?.some(cart => cart?.productID?._id === product?._id)) {
            return { ...product, inCart: true, averageRatings: averageRatings };
        }


        return { ...product, averageRatings: averageRatings };;
    })
    const likeBtnHandle = (id) => {
        dispatch(likeProductAsync({ id, type: "products" }))
    }


    return (
        <div className='products' >
            {products?.map((product, i) => {

                let alreadyliked = product?.likes?.some((like) => like.user === user?.user?.userID);
                let avgRatingInt = parseInt(product?.averageRatings);
                let avgRatingDecimal = Math.round((product?.averageRatings - avgRatingInt) * 10)
                const starStyle = {
                    color: 'gold',
                };

                const grayStarStyle = {
                    color: 'gray',
                };
                console.log(avgRatingDecimal, i);
                const gradientStarStyle = {
                    background: `linear-gradient(to right, gold ${avgRatingDecimal}0%, grey ${10 - avgRatingDecimal}0%)`,
                    backgroundClip: 'text',
                    color: 'transparent',
                };
                // console.log(altproductImage);
                return (
                    <div className="product" key={product._id} >
                        <div className="container">
                            <div className="img-container">
                                <div className="img" onClick={() => navigate(`/product-details/${product?._id}`)}>
                                    <img
                                        src={`http://localhost:4100/uploads/${product?.imageurl}`}
                                        alt={product?.name || 'Product Image'}
                                        onError={(e) => {
                                            e.target.src = altproductImage; // Replace with the path to your placeholder image
                                            e.target.alt = 'Placeholder Image';
                                        }} />
                                </div>
                                <div className="button" onClick={
                                    product?.inCart ? () => {
                                        navigate('/cart')
                                    } : () => {
                                        addToCart(product)
                                        navigate('/cart')
                                    }
                                }>
                                    <button>Buy</button>
                                </div>
                            </div>
                            <div className="productDetails">
                                <div className="title">
                                    {product?.name}
                                    <div className="like-icon">
                                        <span className='like-count'>{product?.likes?.length ? product?.likes?.length : 0}</span>
                                        <FaThumbsUp style={alreadyliked ? { color: "blue" } : null} className='like-btn' onClick={user ? () => likeBtnHandle(product._id) : () => navigate('/sign-in')} />
                                    </div>

                                </div>
                                <div className="price">
                                    Price: &#8377; {" "}
                                    {product?.price}
                                </div>
                                <div className="sizes">
                                    Sizes:  {" "}
                                    {product?.sizes?.map((size, i) => (
                                        <span key={i}>{size} {"  "} &nbsp; </span>
                                    ))}
                                </div>


                                {/* {avgRatingDecimal > 0 ? ( */}
                                <div className="product-rating">
                                    <p>Rating: {product?.averageRatings}</p>
                                    {[1, 2, 3, 4, 5].map((curStar) => {

                                        return (
                                            <React.Fragment key={curStar}>
                                                <span
                                                    style={curStar <= avgRatingInt ? starStyle : grayStarStyle}
                                                >
                                                    ★
                                                </span>
                                                {curStar === avgRatingInt && avgRatingDecimal > 0 && (
                                                    <span style={gradientStarStyle}>★</span>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}

                                </div>


                                <div className="button">

                                    <button disabled={product?.inCart} onClick={
                                        user ? () => {
                                            addToCart(product)
                                            dispatch(prodActions.toggleCart(product._id))
                                        } : () => navigate('/sign-in')
                                    }>{product?.inCart ? "Added" : "Add to Cart"}</button>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            })
            }

        </div >
    )
}

export default Products;
import React, { useEffect, useState } from 'react'

import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { getInitialAsync, productSelector, rateProductAsync, prodActions, likeProductAsync } from '../../redux/reducer/productsReducer';
import { cartSelector, saveToCartAsync } from '../../redux/reducer/cartReducer';
import { useNavigate, useParams } from 'react-router-dom';
import Ratings from '../home/ratings/Ratings';
import { userSelector } from '../../redux/reducer/userReducer';
import { getOneProductByIdAsync } from '../../redux/reducer/productsReducer';
import { FaThumbsUp } from "react-icons/fa";
import altproductImage from '../../img/product.jpeg'

const ProductDetails = () => {
    const carts = useSelector(cartSelector);
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [star, setStar] = useState(0);
    const [ratingText, setRatingText] = useState("");
    // const [averageRatings, setAverageRatings] = useState(0);
    const [isRatePageVisible, setIsRatePageVisible] = useState({});
    const [productDetails, setProductDetails] = useState();
    const { id } = useParams();

    useEffect(() => {
        console.log('Dispatching getOneProductByIdAsync action...');
        dispatch(getOneProductByIdAsync(id)).then((res) => {
            console.log(res);
            if (res.payload) {
                setProductDetails(res.payload);
            }
        });
    }, [dispatch]);
    // console.log(id);

    // const handleStarClick = (ratings) => {

    // }
    const handleRateButtonClick = (id) => {
        dispatch(rateProductAsync({ productID: id, star, ratingText }))
            .then((res) => {
                if (res.payload) {
                    setProductDetails((prevProductDetails) => ({
                        ...prevProductDetails,
                        ratings: res.payload.ratings,
                    }));
                }
            })

    }
    // console.log(productDetails);

    const addToCart = (product) => {
        if (user) {
            const alreadyinCart = carts?.some((cart) => cart?.productID?.toString() === product?._id?.toString());
            // console.log(alreadyinCart);
            if (!alreadyinCart) {
                dispatch(saveToCartAsync(product));
            } else {
                console.log("already in Cart");
            }
        } else {
            navigate('/sign-in');
        }
    }

    let averageRatings = 0
    if (productDetails?.ratings?.length > 0) {
        // console.log("object");
        averageRatings = (productDetails?.ratings?.reduce((acc, cur) => cur.rating + acc, 0) / productDetails.ratings.length).toFixed(1);
    }

    let averageInteger = parseInt(averageRatings);
    // console.log(averageInteger);
    let averageDecimal = Math.round((averageRatings - averageInteger) * 10)
    // console.log(averageDecimal);
    const inCart = carts?.some((cart) => cart?.productID?._id === productDetails?._id)


    const likeBtnHandle = (id, type) => {
        dispatch(likeProductAsync({ id, type }))
            .then((res) => {
                if (res.payload) {
                    console.log(res.payload);
                    setProductDetails((prevProductDetails) => ({
                        ...prevProductDetails,
                        likes: res.payload.likes,
                    }));
                }
            })
    }
    const starStyle = {
        color: 'gold',
    };

    const grayStarStyle = {
        color: 'gray',
    };
    // console.log(averageDecimal);
    const gradientStarStyle = {
        background: `linear-gradient(to right, gold ${averageDecimal}0%, grey ${10 - averageDecimal}0%)`,
        backgroundClip: 'text',
        color: 'transparent',
    };

    let alreadyliked = productDetails?.likes?.some((like) => like.user === user?.userID);
    console.log(productDetails);
    return (
        <>
            <div className="product-details-container" key={productDetails?._id} >
                <div className="img-container">
                    <div className="img" >
                        <img
                            src={`http://localhost:4100/uploads/${productDetails?.imageurl}`}
                            alt={productDetails?.name}
                            onError={(e) => {
                                e.target.src = altproductImage; // Replace with the path to your placeholder image
                                e.target.alt = 'Placeholder Image';
                            }}
                        />

                    </div>
                    <div className="button" onClick={() => {
                        // addToCart(productDetails)
                        dispatch(prodActions.toggleCart(productDetails?._id))
                        // navigate('/cart')
                    }}>
                        <button>Buy</button>
                    </div>
                </div>
                <div className="product-details">
                    <div className="title">
                        {productDetails?.name}
                        <div className="like-icon">
                            <span className='like-count'>{productDetails?.likes?.length ? productDetails?.likes?.length : 0}</span>
                            <FaThumbsUp style={alreadyliked ? { color: "blue" } : null} className='like-btn' onClick={user ? () => likeBtnHandle(productDetails._id, "products") : () => navigate('/sign-in')} />
                        </div>
                    </div>

                    <div className="price">
                        Price: &#8377; {" "}
                        {productDetails?.price}
                    </div>

                    <div className="description">
                        {productDetails?.desc}
                    </div>
                    <div className='averate-rating'>
                        <p>Rating: {averageRatings}</p>
                        {[1, 2, 3, 4, 5].map((curStar) => (
                            <React.Fragment key={curStar}>
                                <span style={curStar <= averageRatings ? starStyle : grayStarStyle}>
                                    ★
                                </span>
                                {curStar === averageInteger && (
                                    <span style={gradientStarStyle}>★</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="sizes">
                        {productDetails?.sizes?.map((size, i) => (
                            <span key={i}>{size} {"  "} &nbsp; </span>
                        ))}
                    </div>
                    <div className="rating">
                        <div>Rate Product</div>
                        {[1, 2, 3, 4, 5].map((curStar) => (
                            <span
                                key={curStar}
                                onClick={() => setStar(curStar)}
                                style={{ cursor: 'pointer', color: curStar <= star ? 'gold' : 'gray' }}
                            >
                                ★
                            </span>
                        ))}

                        {star > 0 ? (
                            <>
                                <div className="rating-text">
                                    <label htmlFor="rating-text"></label>
                                    <input type="text" id='rating-text' onChange={(e) => setRatingText(e.target.value)} />
                                </div>
                                <button onClick={() => {
                                    handleRateButtonClick(productDetails?._id);
                                    setStar(0)
                                }}>Rate</button>
                                <button onClick={() => setStar(0)}>Discard</button>
                            </>
                        ) : null}
                    </div>
                    <div className="button">
                        <button onClick={() => {
                            addToCart(productDetails)
                            dispatch(prodActions.toggleCart(productDetails?._id))
                        }
                        }>{inCart ? "Added" : "Add to Cart"}</button>
                    </div>
                </div>
            </div >
            <div className='rarings-container'>
                <button onClick={() => setIsRatePageVisible(!isRatePageVisible)}>{isRatePageVisible ? "Hide ratings" : 'View ratings'}</button>
                {isRatePageVisible ? <Ratings ratings={productDetails?.ratings} /> : null}
            </div>
        </>
    )
}

export default ProductDetails;
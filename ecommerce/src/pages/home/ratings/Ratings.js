import React, { useEffect, useState } from 'react'
import "./style.scss"
import { FaThumbsUp } from 'react-icons/fa';
import { likeProductAsync } from '../../../redux/reducer/productsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../../redux/reducer/userReducer';
import { useNavigate } from 'react-router-dom';

const Ratings = ({ ratings }) => {

    const user = useSelector(userSelector);
    const navigate = useNavigate();

    let [localRatings, setLocalRatings] = useState(ratings);
    useEffect(() => {
        setLocalRatings(ratings);
    }, [ratings]);

    const dispatch = useDispatch();
    console.log(ratings);

    const likeBtnHandle = (id, type) => {
        dispatch(likeProductAsync({ id, type }))
            .then((res) => {
                if (res.payload) {
                    setLocalRatings(prevRatings => prevRatings.map((rating) => {
                        if (rating._id === id) {
                            return res.payload;
                        }
                        return rating;
                    }));
                }
            })
    }

    return (
        <>
            {localRatings?.length > 0 ? (
                localRatings?.map((rating, i) => {
                    let alreadyliked = rating?.likes?.some((like) => like.user === user?.userID);
                    return (
                        <div className='user-rating-container' key={i}>
                            <div className='user-rating' style={{ listStyleImage: `http://localhost:4100/${rating?.userID?.profileImage}` }}>
                                <div className="image">
                                    <img src={`http://localhost:4100/${rating?.userID?.profileImage}`} alt="userimage" />
                                </div>
                                <div className="name-and-star">
                                    <div className="name">
                                        {rating?.userName}{" "}
                                    </div>
                                    <div className="star-ratings">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ cursor: 'pointer', color: star <= rating?.rating ? 'gold' : 'gray' }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="like-icon">
                                    <span className='like-count'>{rating?.likes?.length ? rating?.likes?.length : 0}</span>
                                    <FaThumbsUp
                                        style={alreadyliked ? { color: "blue" } : null}
                                        className='like-btn'
                                        onClick={user ? () => likeBtnHandle(rating._id, "ratings") : () => navigate('/sign-in')} />
                                </div>
                            </div>
                            <div className="rating-text">
                                {rating?.text}
                            </div>
                        </div>
                    )
                })

            ) : (
                <div className='user-rating-container'>
                    <h1>Rating not available</h1>
                </div>
            )}
        </>
    )
}

export default Ratings
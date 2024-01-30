import React, { useEffect, useState } from 'react'
import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { cartActions, cartSelector, decreaseCartItem, getInitialAsync, increaseCartItem, removeFromCartAsync, setInitialCartAsync } from '../../redux/reducer/cartReducer';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { RiDeleteBin5Line } from 'react-icons/ri';
import { IoBagCheckOutline } from "react-icons/io5";
import { saveToorderAsync } from '../../redux/reducer/orderReducer';
import { useNavigate } from 'react-router-dom';
import altproductImage from '../../img/product.jpeg'
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Cart = () => {
    const carts = useSelector(cartSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log("carts", carts);
    const [deletingProductID, setDeletingProductID] = useState(null);
    const [itemCount, setItemCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal(productID) {
        setDeletingProductID(productID);
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setDeletingProductID(null);
        setIsOpen(false);
    }

    const handleConfirmation = () => {
        if (deletingProductID) {
            dispatch(removeFromCartAsync(deletingProductID))
        }
        closeModal();
    };

    useEffect(() => {
        let itemCount = 0;
        let totalPrice = 0;
        carts?.forEach((cart) => {
            itemCount += cart?.quantity;
            totalPrice += cart?.productID?.price * cart?.quantity;
            // console.log(cart.price * cart.quantity);
        });
        setItemCount(itemCount);
        setTotalPrice(totalPrice);
    }, [carts]);

    useEffect(() => {
        dispatch(cartActions.clearCart());
        dispatch(setInitialCartAsync())
    }, [dispatch])

    const handleIncrease = (id) => {
        dispatch(increaseCartItem(id))
    }
    const handleDecrease = (id) => {
        const item = carts?.find((cart) => cart._id === id);
        if (item?.quantity > 1) {
            dispatch(decreaseCartItem(id))
        }
    }
    const handlePlaceOrder = () => {
        if (carts && carts.length > 0) {
            dispatch(saveToorderAsync())
                .then((res) => {
                    if (res.payload.success) {
                        navigate('/orders')
                        toast.success(res.payload.msg, {
                            className: 'custom-toast'
                        })
                    } else {
                        toast.error(res.payload.msg, {
                            className: 'custom-toast'
                        })
                    }
                })
        } else {
            toast.error("Cart is Empty", {
                className: 'custom-toast'
            })
        }
    }



    // const itemCount = useSelector(itemCountSelector);
    // const totalPrice = useSelector(totalPriceSelector);

    return (
        <div className='cart-container'>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Confirmation Modal"
            >
                <div className="modal-container">

                    <div className="title">
                        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Delete</h2>
                    </div>
                    <div className="description">
                        <p style={{ color: "black" }}>Do you really want to Delete this Item</p>
                    </div>
                    <div className="confirmation-btn">
                        <button onClick={() => handleConfirmation()}>Yes</button>
                        <button onClick={closeModal}>No</button>
                    </div>
                </div>
            </Modal>
            {carts?.map((product, index) => (
                <div className="item" key={index}>
                    <div className="img">
                        <img
                            src={`http://localhost:4100/uploads/${product?.productID?.imageurl}`}
                            alt="product"
                            onError={(e) => {
                                e.target.src = altproductImage; // Replace with the path to your placeholder image
                                e.target.alt = 'Placeholder Image';
                            }} />
                    </div>
                    <div className="item-details">
                        <div className="nameandprice">
                            <div className="name">
                                {product?.productID?.name}
                            </div>
                            <div className="price">
                                Price:  &#8377;{" "}
                                {product?.productID?.price}
                            </div>
                        </div>


                        <div className="action">
                            <div className="minus" onClick={() => handleDecrease(product?._id)}>
                                <AiOutlineMinusCircle />
                            </div>
                            <div className="count">
                                {product?.quantity}
                            </div>
                            <div className="plus" onClick={() => handleIncrease(product?._id)}>
                                <AiOutlinePlusCircle />
                            </div>
                        </div>


                        <div className="delete" onClick={() => openModal(product?._id)}>
                            <RiDeleteBin5Line className='btn' />
                        </div>

                    </div>


                </div>
            ))}
            <div className="checkoutandtotal">

                <div className="total">
                    Total : {" "}
                    {totalPrice}
                </div>
                <div className="quantity">
                    Quantity : {" "}
                    {itemCount}
                </div>
                <div className="checkout" onClick={handlePlaceOrder}>
                    <IoBagCheckOutline className='icon' />
                    Checkout
                </div>
            </div>
        </div>
    )
}

export default Cart
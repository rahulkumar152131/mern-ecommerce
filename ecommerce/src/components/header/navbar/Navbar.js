import React, { useEffect } from 'react'
import "./style.scss";
import { BsCart4 } from "react-icons/bs";
import { FaSignInAlt } from "react-icons/fa"
import logo from '../../../img/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions, cartSelector, setInitialCartAsync } from '../../../redux/reducer/cartReducer';
import { userActions, userSelector } from '../../../redux/reducer/userReducer';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

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

const Navbar = () => {
    const { user } = useSelector(userSelector);
    const dispatch = useDispatch();
    const carts = useSelector(cartSelector);
    const navigate = useNavigate();

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleConfirmation = () => {
        dispatch(cartActions.clearCart());
        localStorage.clear();
        dispatch(userActions.setUser(null));
        navigate("/sign-in");
        toast.success('Logged out Successful !', {
            className: 'custom-toast'
        })
        closeModal();
    };

    useEffect(() => {
        if (!user) {
            const user = JSON.parse(localStorage.getItem('user'));
            const userToken = JSON.parse(localStorage.getItem('userToken'));
            const message = JSON.parse(localStorage.getItem('message'));
            // console.log(userToken);
            if (userToken) {
                dispatch(userActions.setUser({ user, userToken, message }));
                dispatch(setInitialCartAsync());
            }

        } else {
            dispatch(setInitialCartAsync());
        }
    }, [dispatch, user]);
    // console.log(user);
    return (
        <div>
            <div className="navbar" >
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Confirmation Modal"
                >
                    <div className="modal-container">

                        <div className="title">
                            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Logout</h2>
                        </div>
                        <div className="description">
                            <p style={{ color: "black" }}>Do you really want to Logout</p>
                        </div>
                        <div className="confirmation-btn">
                            <button onClick={handleConfirmation}>Yes</button>
                            <button onClick={closeModal}>No</button>
                        </div>
                    </div>
                </Modal>
                <div className="logo" onClick={() => navigate("/")}>
                    <div className="name">
                        AZcart
                    </div>
                    <div className="img">
                        <img src={logo} alt="Logo" />
                    </div>

                </div>
                {user?.userToken ? (
                    <div className='order-product' onClick={() => navigate("/orders")}>
                        Orders
                    </div>
                ) : null}
                {user?.user?.type === "seller" ? (
                    <div className='add-product' onClick={() => navigate("/add-product")}>
                        Add Product
                    </div>
                ) : (
                    null
                )}


                <div className="cartandsign">
                    <div className="cart" onClick={() => { user?.userToken ? navigate("/cart") : navigate('/sign-in') }}>
                        <div className="icon">
                            <BsCart4 />
                        </div>
                        <div className="count">
                            {carts?.length}
                        </div>
                    </div>

                    {user?.userToken ? (
                        <>
                            <div className="profile-image" onClick={
                                () => {
                                    navigate("/profile");
                                }}>
                                <img src={`http://localhost:4100/${user?.user?.profileImage}`} alt="" />
                            </div>
                            <div className="singin" onClick={
                                () => {
                                    openModal();
                                }}>
                                Sign out
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="singin" onClick={() => navigate("/sign-in")}>
                                <FaSignInAlt /> &nbsp;  Sign in
                            </div>

                            <div className="signup" onClick={() => navigate("/sign-up")}>
                                Sign up
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Navbar
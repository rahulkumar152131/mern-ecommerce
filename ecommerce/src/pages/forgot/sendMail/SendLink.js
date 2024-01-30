import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mailSendAsync, userActions, userSelector } from '../../../redux/reducer/userReducer';

const SendLink = () => {
    const { errors, isLoading, msg, success } = useSelector(userSelector);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function handleMailSend(e) {
        e.preventDefault();
        dispatch(mailSendAsync({ email }))
    }

    useEffect(() => {
        dispatch(userActions.resetUserState());
    }, [dispatch])
    
    useEffect(() => {
        if (success) {
            // dispatch(userActions.changeSuccess());
            toast.success(msg, {
                className: 'custom-toast'
            })
            navigate("/sign-in");
        }
        return () => {
            dispatch(userActions.resetUserState());
        }
    }, [msg, success, navigate, dispatch])

    return (
        <div>
            <form onSubmit={(e) => {
                handleMailSend(e);
            }} className='forgot-cotainer'>
                <div className="title">
                    Send Forgot Link
                </div>
                <div className="error">

                    {errors && errors.length > 0 ? (
                        errors.map((error, i) => (
                            <div className="error" key={i}>
                                {error?.msg}
                            </div>
                        ))
                    ) : null}
                </div>
                <div className="email">
                    <input type="email" value={email} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="forgot">
                    <button> {isLoading ? (<div className="loading-animation">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>) : "Send Link"}</button>
                </div>
            </form>
        </div>
    )
}

export default SendLink
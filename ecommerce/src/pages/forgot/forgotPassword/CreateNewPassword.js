import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPasswordAsync, userActions, userSelector } from '../../../redux/reducer/userReducer';

const CreateNewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setisPasswordVisible] = useState(false);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('accesstoken');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { success, isLoading, errors, msg } = useSelector(userSelector);
    async function handlPasswordReset(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Password  and Confirm password did not match", {
                className: 'custom-toast'
            })
        } else {
            dispatch(resetPasswordAsync({ password, token }))
        }
    }
    // console.log(success);
    useEffect(() => {
        dispatch(userActions.resetUserState());
    }, [dispatch])
    useEffect(() => {
        if (success) {
            navigate('/sign-in');
            toast.success(msg, {
                className: 'custom-toast'
            })
        }
        return () => {
            dispatch(userActions.resetUserState());
        }
    }, [success, msg, dispatch, navigate])


    return (
        <div>
            <form onSubmit={(e) => {
                handlPasswordReset(e);
            }} className='reset-cotainer'>
                <div className="title">
                    Reset Password
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
                <div className="password">
                    <input type="password" value={password} placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="password">
                    <input type={isPasswordVisible ? "text" : "password"} value={confirmPassword} placeholder='Enter confirm password' onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <div className="show-password-chekbox">
                        <input type="checkbox" id='show-password' onClick={() => setisPasswordVisible(!isPasswordVisible)} />
                    </div>
                </div>
                <div className="reset">
                    <button> {isLoading ? (<div className="loading-animation">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>) : "Reset Password"}</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewPassword
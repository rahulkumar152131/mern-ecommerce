import React, { useEffect, useState } from 'react'
import "./style.scss"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInAsync, userActions, userSelector } from '../../redux/reducer/userReducer';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoPersonCircleOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";



const validationSchema = Yup.object().shape({
    email: Yup.string().required('Required').email('Invalid Email'),
    password: Yup.string()
        .min(8, 'Atleast 8 characters')
        .max(24, 'Atmax 24 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/,
            ' Must like (e.g., Password@123)'
        )
        .required('Password is required'),

});



const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { errors, isLoading, success, msg } = useSelector(userSelector);

    const handleSignin = async (values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
        dispatch(signInAsync({ email: values.email, password: values.password }))

    }
    console.log(errors);

    useEffect(() => {
        if (success) {
            navigate('/');
            toast.success(msg, {
                className: 'custom-toast'
            })
        } else if (errors) {
            toast.error(errors?.[0]?.msg, {
                className: 'custom-toast'
            })
        }
        return () => {
            dispatch(userActions.resetUserState());
        }
    }, [success, errors, msg, navigate, dispatch])

    // useEffect(() => {
    //     dispatch(userActions.resetUserState());
    // }, [dispatch])

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSignin}>
            {({ isSubmitting, errors, isValid, touched, values }) => (
                <Form className='signin-cotainer'>
                    <div className="title">
                        <IoPersonCircleOutline />
                    </div>


                    <div className="email">
                        <div className="email-error-and-label">
                            <div className="label">
                                <label htmlFor="email">Email</label>
                            </div>
                            {(touched.email && !errors.email) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="email" component="div" />
                            )}
                        </div>
                        <Field type="email" name="email" placeholder="Enter Email" />
                    </div>

                    <div className="password">
                        <div className="password-error-and-label">
                            <div className="label">
                                <label htmlFor="password">Password</label>
                            </div>
                            {(touched.password && !errors.password) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage name="password" className='field-error' component="div" />
                            )}
                        </div>
                        <Field type="password" name="password" placeholder="Enter Password" />
                    </div>
                    <div className="signin">
                        <button type="submit" disabled={isSubmitting}> {isLoading ? (<div className="loading-animation">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>) : "Sign In"}</button>
                    </div>
                    <div className="forgot-signup-instead">
                        <div className="forgot" onClick={() => navigate("/forgot-password")}>
                            Forgot password
                        </div>
                        <div className="signup" onClick={() => navigate("/sign-up")}>
                            Or SignUp instead
                        </div>
                    </div>

                </Form>
            )}
        </Formik>
    )
}

export default SignIn
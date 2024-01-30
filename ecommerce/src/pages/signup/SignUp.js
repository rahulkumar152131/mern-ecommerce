import React, { useEffect, useState } from 'react'
import "./style.scss"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoPersonCircleOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { BsFillPersonPlusFill } from "react-icons/bs";



import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInAsync, signUpAsync, userActions, userSelector } from '../../redux/reducer/userReducer';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    type: Yup.string().required('Required'),
    name: Yup.string().min(3, 'At least 3 characters').max(25, 'At most 25 characters').required('Required'),
    email: Yup.string().required('Required').email('Invalid Email'),
    password: Yup.string()
        .min(8, 'At least 8 characters')
        .max(24, 'At most 24 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/,
            'Must meet the required criteria (e.g., Password@123)'
        )
        .required('Required'),
    cnfPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    profileImage: Yup.mixed()
        .test("fileType", "Invalid file format", (value) => {
            const acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            return value && acceptedFormats.includes(value.type);
        })
        .required("Profile image is required"),
});


const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(null);

    // useEffect(() => {
    //     dispatch(userActions.resetUserState());
    // }, [dispatch])
    const handleImageInput = (event, setFieldValue, validateField) => {

        setFieldValue("profileImage", event.currentTarget.files[0]);
        if (event.currentTarget.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(event.currentTarget.files[0]);
            validateField('profileImage');
        } else {
            setImagePreview(null);
        }

    }

    const { errors, msg, isLoading, success } = useSelector(userSelector);

    const handleSignup = async (values, { setSubmitting }) => {
        setSubmitting(false);
        dispatch(signUpAsync({ type: values.type, name: values.name, email: values.email, password: values.password, profileImage: values.profileImage }))
            .then((res) => {
                if (res.payload.success) {
                    dispatch(signInAsync({ email: values.email, password: values.password }))
                    navigate('/')
                }
            })
    }
    useEffect(() => {
        if (success) {
            toast.success(msg, {
                className: 'custom-toast'
            })
        }
        return () => {
            dispatch(userActions.resetUserState());
        }
    }, [success, msg, navigate, dispatch])

    return (
        <Formik
            initialValues={{
                type: 'seller',
                name: '',
                email: '',
                password: '',
                cnfPassword: '',
                profileImage: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}>
            {({ isSubmitting, isValid, errors, touched, setFieldTouched, values, handleChange, validateField, setFieldValue }) => (
                <Form className='signup-cotainer'>

                    <div className="title">
                        <BsFillPersonPlusFill />
                    </div>
                    <div className="type">
                        <label htmlFor="type">Consumer type </label>
                        <select name="type" id="type" value={values.type} onChange={handleChange}>
                            <option value="seller">Seller</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div className="name">
                        <div className="name-error-and-label">
                            <div className="label">
                                <label htmlFor="name">Name</label>
                            </div>
                            {(touched.name && !errors.name) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="name" component="div" />
                            )}
                        </div>
                        <Field type="text" name="name" placeholder="Enter Name" />
                    </div>
                    <div className="email">
                        <div className="email-error-and-label">
                            <div className="label">
                                <label htmlFor="email">Email</label>
                            </div>
                            {(touched.email && !errors?.email) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="email" component="div" />
                            )}
                        </div>
                        <Field type="text" name="email" placeholder="Enter Email" />
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
                    <div className="password">
                        <div className="password-error-and-label">
                            <div className="label">
                                <label htmlFor="cnfPassword">Confirm Password</label>
                            </div>
                            {(touched.cnfPassword && !errors.cnfPassword) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage name="cnfPassword" className='field-error' component="div" />
                            )}
                        </div>
                        <Field type="password" name="cnfPassword" placeholder="Enter Confirm Password" />
                    </div>

                    <div className="image-input">
                        <div className="profile-image-error-and-label">
                            <div className="label">
                                <label htmlFor="profileImage">Profile Image</label>
                            </div>
                            {(touched.profileImage && !errors.profileImage) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage name="profileImage" className='field-error' component="div" />
                            )}
                        </div>
                        <div className="input-and-preview">
                            <input
                                onBlur={() => setFieldTouched("profileImage", true)}
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                onChange={(event) => handleImageInput(event, setFieldValue, validateField)}
                            />
                            <div className="preview-image">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="signup">
                        <button type="submit" disabled={isSubmitting}> {isLoading ? (<div className="loading-animation">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>) : "Sign Up"}</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default SignUp
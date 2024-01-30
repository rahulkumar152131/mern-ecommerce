import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducer/userReducer'
import './style.scss';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IoPersonCircleOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'At least 3 characters').max(25, 'At most 25 characters').required('Required'),
    profileImage: Yup.mixed()
        .test("fileType", "Invalid file format", (value) => {
            console.log(value);
            const acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            return value && acceptedFormats.includes(value.type);
        })
        .required("Profile image is required"),
});

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useSelector(userSelector);
    const initialImage = `http://localhost:4100/${user?.user?.profileImage}`
    const [imagePreview, setImagePreview] = useState(initialImage);
    // console.log("user", user);
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

    const handleEditDetails = async (values, { setSubmitting }) => {
        setSubmitting(false);

    }
    // console.log(user?.user?.userName);
    return (
        <Formik
            initialValues={{
                name: user?.user?.userName,
                password: '',
                cnfPassword: '',
                profileImage: user?.user?.profileImage,
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleEditDetails}>
            {({ isSubmitting, isValid, errors, touched, setFieldTouched, values, handleChange, validateField, setFieldValue }) => (
                <Form className='user-container'>
                    <div className="user-image">
                        <img src={initialImage} alt="Preview" />
                    </div>
                    <div className="user-details">

                        <div className="type">
                            Type :{" "}
                            {user?.user?.type}
                        </div>
                        <div className="username">
                            {isEditing ? (
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
                                    {console.log(values)}
                                    <Field type="text" name="name" value={values.name} placeholder="Enter Name" />
                                </div>
                            ) : (
                                <>
                                    Name :{" "}
                                    {user?.user?.userName}
                                </>
                            )}
                        </div>
                        <div className="email">
                            Email :{" "}
                            {user?.user?.email}
                        </div>
                        <div className="image-input">
                            {isEditing ? (
                                <>
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
                                    </div>
                                </>
                            ) : (
                                null
                            )}

                        </div>
                        <div className="edit-user-details">
                            <button type='submit' onClick={() => setIsEditing(!isEditing)}>Edit Details</button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default Profile



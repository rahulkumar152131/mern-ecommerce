import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import * as Yup from 'yup';
import { TiTick } from "react-icons/ti";

import "./style.scss"

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAsync } from '../../redux/reducer/userReducer';
import { toast } from 'react-toastify';
import { addProductAsync, prodActions, productSelector } from '../../redux/reducer/productsReducer';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    price: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Required'),
    category: Yup.array()
        .min(1, 'Select at least one category')
        .required('Required'),
    size: Yup.array().optional(),
    description: Yup.string().required('Required'),
    stocks: Yup.number().min(0, 'Stocks must be greater than or equal to 0').required('Required'),
    imageurl: Yup.mixed()
        .test("fileType", "Invalid file format", (value) => {
            const acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            return value && acceptedFormats.includes(value.type);
        })
        .required("Image image is required"),
});

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(null);

    const categoryOptions = [
        { value: 'electronics', label: 'Electronics' },
        { value: 'shirt', label: 'Shirt' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'jewellery', label: 'Jewellery' },
        { value: 'men-s-wear', label: "Men's Wear" },
        { value: 'women-s-wear', label: "Women's Wear" },
    ];
    const sizeOptions = [
        { value: 'L', label: 'L' },
        { value: 'M', label: 'M' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
        { value: 'S', label: "S" },
        { value: 'XS', label: "XS" },
    ];
    const { isLoading, success, msg, errors, } = useSelector(productSelector);
    
    const handleAddProduct = async (values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
        dispatch(addProductAsync({
            name: values.name,
            price: values.price,
            category: values.category,
            sizes: values.size,
            desc: values.description,
            stocks: values.stocks,
            imageurl: values.imageurl
        }))
    }

    useEffect(() => {
        if (success) {
            toast.success(msg, {
                className: 'custom-toast'
            })
            navigate('/')
            // setCleanup(true);
        }
        return () => {
            dispatch(prodActions.resetProductState());
        }
    }, [success, msg, navigate, dispatch])

    const handleImageChange = (event, setFieldValue, validateField) => {
        setFieldValue("imageurl", event.currentTarget.files[0]);
        if (event.currentTarget.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(event.currentTarget.files[0]);
            validateField('imageurl');
        } else {
            setImagePreview(null);
        }
    };



    const handleCategoryChange = (selectedOptions, setFieldValue, validateField) => {
        selectedOptions = selectedOptions.map((option) => {
            return option.value;
        })
        setFieldValue("category", selectedOptions);
        validateField("category");

    };
    const handleSizeChange = (selectedOptions, setFieldValue, validateField) => {
        selectedOptions = selectedOptions.map((option) => {
            return option.value;
        })
        setFieldValue("size", selectedOptions);
        validateField("size");
    };

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                price: '',
                category: [],
                size: [],
                stocks: '',
                imageurl: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddProduct}
            validateOnBlur={true}
            validateOnChange={true}
        >
            {({ isSubmitting, isValid, errors, touched, values, handleChange, validateField, setFieldValue, setFieldTouched }) => (
                <Form className='product-cotainer'>
                    <div className="product-title">
                        Add Product
                    </div>

                    <div className="product-name">
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
                        <Field
                            type="text"
                            name="name"
                            id='name'
                            placeholder='Eg :- iPhone 17'
                        />
                    </div>
                    <div className="price">
                        <div className="price-error-and-label">
                            <div className="label">
                                <label htmlFor="price">Price</label>
                            </div>
                            {(touched.price && !errors.price) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="price" component="div" />
                            )}
                        </div>
                        <Field
                            type="number"
                            name="price"
                            min={0}
                            id='price'
                            placeholder='Eg :- 99'
                        />
                    </div>
                    <div className="product-category">
                        <div className="category-error-and-label">
                            <div className="label">
                                <label htmlFor="category">Category</label>
                            </div>
                            {(touched.category && !errors.category) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="category" component="div" />
                            )}
                        </div>
                        <Select
                            name="category"
                            onBlur={() => setFieldTouched("category", true)}
                            onChange={(selectedOptions) => handleCategoryChange(selectedOptions, setFieldValue, validateField)}
                            options={categoryOptions}
                            className="category-select"
                            classNamePrefix="category-select-prefix"
                            isMulti={true}
                        />

                    </div>
                    <div className="product-size">
                        <div className="size-error-and-label">
                            <div className="label">
                                <label htmlFor="size">Size</label>
                            </div>
                            {(touched.size && !errors.size) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="size" component="div" />
                            )}
                        </div>
                        <Select
                            name='size'
                            onBlur={() => setFieldTouched("size", true)}
                            onChange={(selectedOptions) => handleSizeChange(selectedOptions, setFieldValue, validateField)}
                            options={sizeOptions}
                            className="category-select"
                            classNamePrefix="category-select-prefix"
                            isMulti={true}
                        />
                    </div>
                    <div className="product-description">
                        <div className="description-error-and-label">
                            <div className="label">
                                <label htmlFor="description">Description</label>
                            </div>
                            {(touched.description && !errors.description) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="description" component="div" />
                            )}
                        </div>
                        <Field as="textarea" type="text" name='description' id='description' placeholder='Enter product description' />
                    </div>
                    <div className="stocks">
                        <div className="stocks-error-and-label">
                            <div className="label">
                                <label htmlFor="stocks">Stocks</label>
                            </div>
                            {(touched.stocks && !errors.stocks) ? (
                                <TiTick className="success-icon" />
                            ) : (
                                <ErrorMessage className='field-error' name="stocks" component="div" />
                            )}
                        </div>
                        <Field type="number" name="stocks" placeholder='Eg :- 9' />
                    </div>
                    <div className="product-image">
                        <div className="image-input">
                            <div className="productImage-error-and-label">
                                <div className="label">
                                    <label htmlFor="imageurl">Image</label>
                                </div>
                                {(touched.imageurl && !errors.imageurl) ? (
                                    <TiTick className="success-icon" />
                                ) : (
                                    <ErrorMessage className='field-error' name="imageurl" component="div" />
                                )}
                            </div>
                            <input
                                onBlur={() => setFieldTouched("imageurl", true)}
                                type="file"
                                name='imageurl'
                                onChange={(event) => handleImageChange(event, setFieldValue, validateField)} />
                        </div>
                        <div className="preview">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                />
                            )}
                        </div>
                    </div>
                    <div className="add-btn">
                        <button type="submit"> {isLoading ? (<div className="loading-animation">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>) : "Add Product"}</button>

                    </div>
                </Form>
            )
            }
        </Formik >

    )
}

export default AddProduct
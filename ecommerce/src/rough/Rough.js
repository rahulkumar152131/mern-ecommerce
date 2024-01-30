import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Required').email('Invalid email address'),
    password: Yup.string().required('Required'),
});

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

const Rough = () => {
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
    const [submittedDetails, setSubmittedDetails] = useState(null);

    // Modal.setAppElement('#root');

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    // const openModal = () => setIsModalOpen(true);
    // const closeModal = () => setIsModalOpen(false);

    const handleConfirmation = () => {

        closeModal();
    };

    const handleSubmit = (values, { setSubmitting }) => {

        setSubmittedDetails({
            email: values.email,
            password: values.password,
        });
        openModal();
        setSubmitting(false);
    };

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Confirmation Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
                <p style={{ color: "black" }}>Do you really want to submit the form?</p>
                {submittedDetails && (
                    <div style={{ color: "black" }}>
                        <p>Email: {submittedDetails.email}</p>
                        <p>Password: {submittedDetails.password}</p>
                    </div>
                )}
                <button onClick={handleConfirmation}>Yes</button>
                <button onClick={closeModal}>No</button>
            </Modal>
            <h1>Anywhere in your app!</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <form onSubmit={formikProps.handleSubmit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <Field
                                type="text"
                                name="email"
                            />
                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                            />
                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} />
                        </div>

                        <button type="submit" disabled={formikProps.isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default Rough;

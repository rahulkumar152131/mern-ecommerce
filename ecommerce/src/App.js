import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Fragment } from "react";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./components/header/navbar/Navbar";
import Products from "./pages/home/products/Products";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import PageNotFount from "./pages/404/PageNotFount";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import './index.css'
import AddProduct from "./pages/addProduct/AddProduct";
import CreateNewPassword from "./pages/forgot/forgotPassword/CreateNewPassword";
import SendLink from "./pages/forgot/sendMail/SendLink";
import Order from "./pages/order/Order";
import Rough from "./rough/Rough";
import Profile from "./pages/profile/Profile";


function App() {


  return (
    <div >
      <Provider store={store}>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/"
              element={
                <Fragment>
                  <Navbar />
                  <Home />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="add-product"
              element={
                <Fragment>
                  <Navbar />
                  <AddProduct />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="product-details/:id"
              element={
                <Fragment>
                  <Navbar />
                  <ProductDetails />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="cart"
              element={
                <Fragment>
                  <Navbar />
                  <Cart />
                  <Footer />
                </Fragment>
              }
            />


            <Route path="/sign-in"
              element={
                <Fragment>
                  <Navbar />
                  {/* <Rough/> */}
                  <SignIn />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="/profile"
              element={
                <Fragment>
                  <Navbar />
                  <Profile />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="/forgot-password"
              element={
                <Fragment>
                  <Navbar />
                  <SendLink />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="/reset-password"
              element={
                <Fragment>
                  <Navbar />
                  <CreateNewPassword />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="/orders"
              element={
                <Fragment>
                  <Navbar />
                  <Order />
                  <Footer />
                </Fragment>
              }
            />
            <Route path="/sign-up"
              element={
                <Fragment>
                  <Navbar />
                  <SignUp />
                  <Footer />
                </Fragment>
              }
            />


            <Route path="*"
              element={
                <PageNotFount />
              } />


          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

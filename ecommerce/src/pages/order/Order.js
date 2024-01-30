import axios, { all } from 'axios';
import React, { useEffect, useState } from 'react'
import "./style.scss"
import { useDispatch, useSelector } from 'react-redux';
import { orderSelector, setInitialorderAsync } from '../../redux/reducer/orderReducer';

const Order = () => {
  const { orders } = useSelector(orderSelector);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(setInitialorderAsync())
  }, [dispatch])
  return (
    <>

      <div className='order-container'>
        <div className="order-title">
          Your Orders
        </div>

        {orders?.map((order) => (
          <div className="allorder" key={order._id}>
            <div className="order-on">
              Order on:- {order?.orderDate?.slice(0, 10)}
            </div>
            <table key={order?.id}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              {
                order?.items?.map((item) => (
                  <tbody className="order" key={item._id}>
                    <tr>
                      <td className="title">
                        {item?.productID?.name}
                      </td>
                      <td className="price">

                        &#x20B9; {" "}
                        {Math.floor(item?.productID?.price)}
                      </td>
                      <td className="quantity">
                        {item?.quantity}
                      </td>
                      <td className="total">
                        &#x20B9; {" "}
                        {Math.floor(item?.quantity * item?.productID?.price)}
                      </td>
                    </tr>
                  </tbody>

                ))
              }
              <tfoot className="total-sum">
                <tr className='total-price'>

                  <td colSpan='4'>
                    &#x20B9; {" "}
                    {Math.floor(order?.items?.reduce((acc, cur) => {
                      return cur?.productID?.price * cur?.quantity + acc;
                    }, 0))}

                  </td>
                </tr>
              </tfoot>
            </table>

          </div>
        ))}

      </div>

    </>
  )
}

export default Order
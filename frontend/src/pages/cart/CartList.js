import React, { useCallback, useEffect, useState } from "react";
import { FaFolderMinus, FaFolderPlus, FaTrash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/loading.component";
import { getCartDetail as getMyCartDetail } from "../../reducers/cart.reducer";
import cartSvc from "../cms/cart/cartService";

const CartList = () => {
  const [cartDetail, setCartDetail] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  let [cartIds, setCartIds] = useState([]);
  const addCartIds = (e,id) => {
    const { checked } = e.target;
    const ids = [...cartIds] || []
    if (checked) {
      ids.push(id)
    } else {
      const indexOf = ids.indexOf(id)
      ids.splice(indexOf, 1)
      console.log(indexOf)
    }
    setCartIds(ids)
    console.log(setCartIds)
  };
  const checkoutOrder = async () => {
    try {
      const response = await cartSvc.checkoutCart(cartIds);
      toast.success(response.message);
      navigate('/');
    } catch (exception) {
      toast.error("Cannot checkout at this moment!");
      console.error(exception);
    }
  };

  const getCartDetail = useCallback(async () => {
    try {
      const response = await cartSvc.getMyCart();
      console.log(response)
      setCartDetail(response.result);
    } catch (exception) {
      toast.error("Error fetching cart Detail");
      console.error(exception);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCartDetail();
  }, []);

  const deleteCart = async (id) => {
    try {
      setLoading(true);
      const response = await cartSvc.removeFromCart(id);
      dispatch(getMyCartDetail());
      await getCartDetail();
      toast.success("Cart deleted successfully");
    } catch (exception) {
      toast.error("Cart cannot be deleted at this moment");
      console.error(exception);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, qty) => {
    try {
      setLoading(true);
      const response = await cartSvc.addToCart({ productId, quantity: qty });
      await getCartDetail();
      dispatch(getMyCartDetail());
      toast.success("Cart updated successfully");
    } catch (exception) {
      toast.error("Cart cannot be updated at this moment");
      console.error(exception);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-5">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold">Cart Detail</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 border border-gray-200" style={{ width: "50px" }}>#</th>
                  <th className="p-2 border border-gray-200" style={{ width: "30%" }}>Title</th>
                  <th className="p-2 border border-gray-200" style={{width:"15%"}}>Thumb</th>
                  <th className="p-2 border border-gray-200">Price (In Npr)</th>
                  <th className="p-2 border border-gray-200" style={{width:"15%"}}>Quantity</th>
                  <th className="p-2 border border-gray-200">Amount (In Npr)</th>
                  <th className="p-2 border border-gray-200">#</th>
                </tr>
              </thead>
              <tbody>
                  {
                    cartDetail && cartDetail.map((item, ind) => (
                  <tr key={ind}>
                    <td className="text-center border border-gray-200 p-2">
                      <input
                        type="checkbox"
                            onChange={(e) => {
                              addCartIds(e, item._id)
                        }}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">{item.productId && item.productId.title}</td>
                    <td className="border border-gray-200 p-2">
                      <img
                        className="w-44 h-24 object-cover items-center"
                        src={`${process.env.REACT_APP_IMAGE_URL}/${item.productId.images[0]}`}
                        alt={item.productId.title}
                      />
                    </td>
                    <td className="border border-gray-200 p-2 text-center">Npr.{item.price}</td>
                    <td className="border border-gray-200 p-2 text-center">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-5"
                        onClick={(e) =>{
                          updateCart(item.productId._id, +item.quantity - 1)
                        }}
                      >
                        <FaFolderMinus />
                      </button>
                      {item.quantity}
                      <button
                        className="bg-yellow-500 text-white px-1 py-1 rounded ml-2"
                        onClick={(e) =>{
                          updateCart(item.productId._id, +item.quantity + 1)
                        }}
                      >
                        <FaFolderPlus />
                      </button>
                    </td>
                    <td className="border border-gray-200 p-2 text-center">Npr. {item.quantity * item.price}</td>
                    <td className="border border-gray-200 p-2 text-center">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                            onClick={(e) => {
                              deleteCart(item._id)
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 text-left">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={checkoutOrder}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartList;



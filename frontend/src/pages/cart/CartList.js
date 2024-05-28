import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "../../component/common/loading/loading.component";
import { getCartDetail as getMyCartDetail } from "../../reducers/cart.reducer";
import cartSvc from "../cms/cart/cart.service";

const CartList = () => {
  const [cartDetail, setCartDetail] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  let [cartIds, setCartIds] = useState([]);
  const addCartIds = (e, id) => {
    const { checked } = e.target;
    const ids = [...cartIds] || [];
    if (checked) {
      ids.push(id);
    } else {
      const indexOf = ids.indexOf(id);
      ids.splice(indexOf, 1);
    }
    setCartIds(ids);
  };

  const checkoutOrder = async () => {
    try {
      const response = await cartSvc.checkoutCart(cartIds);
      toast.success(response.message);
      //Todo trassaction
      navigate('/');
    } catch (exception) {
      toast.error("Cannot checkout at this moment!");
    }
  };

  const getCartDetail = useCallback(async () => {
    try {
      const response = await cartSvc.getMyCart();
      setCartDetail(response.result);
    } catch (exception) {
      toast.error("Error fetching cart Detail");
      console.log(exception);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getCartDetail();
  }, [getCartDetail]);

  const deleteCart = async (id) => {
    try {
      setLoading(true);
      await cartSvc.removeFromCart(id);
      dispatch(getMyCartDetail());
      await getCartDetail();
      toast.success("Cart deleted successfully");
    } catch (exception) {
      toast.error("Cart cannot be deleted at this moment");
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, qty) => {
    try {
      setLoading(true);
      await cartSvc.addToCart({ productId, quantity: qty });
      await getCartDetail();
      dispatch(getMyCartDetail());
      toast.success("Cart updated successfully");
    } catch (exception) {
      toast.error("Cart cannot be updated at this moment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-5">
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="text-center mb-5">
            <h1>Cart Detail</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 border border-gray-200" style={{ width: "50px" }}>#</th>
                  <th className="p-2 border border-gray-200" style={{ width: "45%" }}>Title</th>
                  <th className="p-2 border border-gray-200">Thumb</th>
                  <th className="p-2 border border-gray-200">Price (In Npr)</th>
                  <th className="p-2 border border-gray-200">Quantity</th>
                  <th className="p-2 border border-gray-200">Amount (In Npr)</th>
                  <th className="p-2 border border-gray-200">#</th>
                </tr>
              </thead>
              <tbody>
                {cartDetail && cartDetail.map((item, ind) => (
                  <tr key={ind}>
                    <td className="text-center border border-gray-200 p-2">
                      <input
                        type="checkbox"
                        onChange={(e) => addCartIds(e, item._id)}
                      />
                    </td>
                    <td className="border border-gray-200 p-2">{item.productId.title}</td>
                    <td className="border border-gray-200 p-2">
                      <img
                        className="w-20 h-20 object-cover"
                        src={`${import.meta.env.VITE_IMAGE_URL}/${item.productId.images[0]}`}
                        alt={item.productId.title}
                      />
                    </td>
                    <td className="border border-gray-200 p-2">Npr.{item.price}</td>
                    <td className="border border-gray-200 p-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => updateCart(item.productId._id, +item.quantity - 1)}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                      {item.quantity}
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => updateCart(item.productId._id, +item.quantity + 1)}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </td>
                    <td className="border border-gray-200 p-2">Npr. {item.quantity * item.price}</td>
                    <td className="border border-gray-200 p-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => deleteCart(item._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-5 text-right">
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

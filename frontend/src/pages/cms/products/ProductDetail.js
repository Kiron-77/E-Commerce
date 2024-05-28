import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "../../component/common/loading/loading.component";
import { SingleProduct } from "../../component/common/product/single-product.component";
import { getCartDetail } from "../../reducers/cart.reducer";
import cartSvc from "../cms/cart/cart.service";
import productSvc from "../cms/product/product.service";

const ProductDetail = () => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState();
  const [related, setRelated] = useState();
  const [qty, setQty] = useState(0);
  const [qtyErr, setErr] = useState();

  const dispatch = useDispatch();

  const params = useParams();
  const navigate = useNavigate();
  const productDetailBySlug = useCallback(async () => {
    try {
      let response = await productSvc.getProductBySlug(params.slug);
      setDetail(response.result.detail);
      setRelated(response.result.related);
    } catch (exception) {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  }, [params]);
  
  useEffect(() => {
    productDetailBySlug();
  }, [productDetailBySlug]);

  const showError = (e) => {
    e.target.src = 'https://placehold.co/300x250?text=No+Image+Found';
  };

  const addToCart = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("_au");
      if (!token) {
        localStorage.setItem("_redirectUrl", '/product/' + detail.slug);
        toast.warning("Please login first to add item in cart");
        navigate('/login');
      } else {
        const cartItem = {
          productId: detail._id,
          quantity: +qty,
        };
        const response = await cartSvc.addToCart(cartItem);
        dispatch(getCartDetail());
        toast.success("Your Item has been successfully added in the cart");
      }
    } catch (exception) {
      toast.error("Sorry!! this Item cannot be added in the cart right now");
    }
  };

  return (
    <div className="container mx-auto my-5 py-5">
      {loading ? (
        <LoadingComponent />
      ) : (
        detail ? (
          <>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 p-2">
                <div className="carousel">
                  {detail.images && detail.images.map((img, ind) => (
                    <div key={ind} className="carousel-item">
                      <img onError={showError} className="object-cover w-full h-full" src={`${import.meta.env.VITE_IMAGE_URL}/${img}`} alt="" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 p-2">
                <h4 className="mb-3">{detail.title}</h4>
                <div className="mb-3">
                  <strong>Brand:</strong> <span>{detail.brand ?? "No Brand"}</span>
                </div>
                <div className="mb-3">
                  <strong>Category:</strong>
                  <div className="flex flex-wrap">
                    {detail.category && detail.category.map((cat, ind) => (
                      <span key={ind} className="bg-blue-500 text-white rounded-full px-2 py-1 text-sm mr-2 mb-2">{cat.title}</span>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Price:</strong> <span className="mr-3">Npr.{detail.afterDiscount}</span>
                  {detail.discount > 0 && (
                    <>
                      <del className="text-red-500">Npr.{detail.price}</del>&nbsp;<span className="text-red-500">(-{detail.discount}% Off)</span>
                    </>
                  )}
                </div>
                <div className="mb-3">
                  <strong>Attributes</strong>
                  {detail.attributes && detail.attributes.map((attr, ind) => (
                    <div key={ind} className="mb-2">
                      <div>{attr.name}</div>
                      <div>
                        {attr.value && attr.value.map((val, index) => (
                          <span key={index} className="mr-2">{val}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-3 flex">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 mr-2"
                    onChange={(e) => {
                      const quantity = e.target.value;
                      if (quantity < 0) {
                        setErr("Quantity should be greater than or equal to 0");
                      } else if (quantity > 10) {
                        setErr("Quantity should not be greater than 10");
                      } else {
                        setErr(null);
                      }
                      setQty(e.target.value);
                    }}
                    placeholder="0"
                    min={0}
                    max={10}
                  />
                  <button onClick={addToCart} disabled={qtyErr ? true : false} className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    Add to Cart
                  </button>
                </div>
                <span className="text-red-500">{qtyErr}</span>
              </div>
            </div>
            <div className="mt-5">
              <div className="w-full md:w-3/4" dangerouslySetInnerHTML={{ __html: detail.description }}></div>
              <div className="w-full md:w-1/4">
                {related && related.map((singleRel, ind) => (
                  <div key={ind} className="mb-3">
                    <SingleProduct product={singleRel} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-red-500 text-center">Product does not exist</p>
        )
      )}
    </div>
  );
};

export default ProductDetail;

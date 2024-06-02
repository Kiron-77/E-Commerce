import { useCallback, useEffect, useState } from "react";
import { FaStarHalf } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SingleProduct } from "../../../components/product/SingleProduct";
import { getCartDetail } from "../../../reducers/cart.reducer";
import cartSvc from "../../cms/cart/cartService";
import productSvc from "../../cms/products/productService";

const ProductDetail = () => {
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState();
    const [related, setRelated] = useState();
    const [qty, setQty] = useState(0);
    const [qtyErr, setErr] = useState();

    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
        x: 0,
        y: 0
    })
    const [zoomImage, setZoomImage] = useState(false)

    const dispatch = useDispatch();

    const productImageListloading = new Array(4).fill(null);
    const [activeImage, setActiveImage] = useState("");

    const params = useParams();
    const navigate = useNavigate();
    const productDetailBySlug = useCallback(async () => {
        try {
            let response = await productSvc.getProductDetailBySlug(params.slug);
            console.log(response)
            setDetail(response.result.detail);
            setRelated(response.result.related);
            // setActiveImage(response?.result?.activeImage[0]);
            if (response?.result?.activeImage && response.result.activeImage.length > 0) {
                setActiveImage(response.result.activeImage[0]);
            } else {
                setActiveImage('');
            }
        } catch (exception) {
            toast.error("Product not found");
            console.log(exception);
        } finally {
            setLoading(false);
        }
    }, [params]);

    const handleMouseEnterProduct = (imageUrl) => {
        setActiveImage(imageUrl);
    };

    useEffect(() => {
        productDetailBySlug();
    }, [params]);

    const showError = (e) => {
        e.target.src = 'https://placehold.co/300*250?text=No+Image+Found';
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
    }
    const handleZoonImage = useCallback((e) => {
        setZoomImage(true)
        const { left, top, width, height } = e.target.getBoundingClientRect()
        console.log("cordinate", left, top, width, height)

        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        setZoomImageCoordinate({
            x,
            y
        })

    }, [zoomImageCoordinate])

    const handleLeaveImageZoom = () => {
        setZoomImage(false)
    }

    return (
        <>
            <div className="container mx-auto p-4 ">
                <div className="flex-grow">
                    <div className="min-h-[200px] flex flex-col lg:flex-row ">
                        <div className="h-96 flex flex-col lg:flex-row-reverse w-full">
                            <div className="h-full flex lg:flex-row gap-8 w-full mt-10">
                                {
                                    loading ? (
                                        <div className="h-full flex gap-2 lg:flex-col overflow-x-auto lg:overflow-y-auto scrollbar-none">
                                            {
                                                productImageListloading.map((el, index) => (
                                                    <div className="h-20 w-20 bg-slate-200 rounded animate-pulse" key={index}>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        detail && (
                                            <>
                                                <div className="h-full flex gap-2 lg:flex-col overflow-x-auto lg:overflow-y-auto scrollbar lg:overflow-x-hidden justify-center items-center">
                                                    {
                                                        detail.images && detail.images.map((img, ind) => (
                                                            <div className="h-32 w-full min-w-[200px] p-1 flex-shrink-0 " key={ind}>
                                                                <img
                                                                    onError={showError}
                                                                    className="w-full h-full object-scale-down mix-blend-multiply cursor-pointe"
                                                                    src={process.env.REACT_APP_IMAGE_URL + '/' + img}
                                                                    alt=""
                                                                    onMouseEnter={() => handleMouseEnterProduct(process.env.REACT_APP_IMAGE_URL + '/' + img)}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className="flex flex-col h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 mt-6 lg:mt-0 lg:ml-4 relative">
                                                    <img src={activeImage} className="h-full w-full object-scale-down mix-blend-multiply" onMouseMove={handleZoonImage} onMouseLeave={handleLeaveImageZoom} />

                                                    {/* **product zoom** */}
                                                    {
                                                        zoomImage && (
                                                            <div className="absolute hidden lg:block min-w-[500px] min-h-[400px] overflow-hidden bg-slate-200 p-1 -right-[510px] top-0">
                                                                <div className="h-full w-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-125"
                                                                    style={{
                                                                        backgroundImage: `url(${activeImage})`,
                                                                        backgroundRepeat: "no-repeat",
                                                                        backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                                                                    }}>

                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                                <div className="">
                                                    <h4 className="mb-3 font-bold text-xl">{detail.title}</h4>
                                                    <div className="mb-3 flex ">
                                                        <div className="font-bold w-48">Brand:</div>
                                                        <div>{detail.brand?.name ?? "No Brand"}</div>
                                                    </div>
                                                    <div className="mb-3 flex ">
                                                        <div className="font-bold w-48">Category:</div>
                                                        <div>
                                                            {
                                                                detail.category && detail.category.map((cat, ind) => (
                                                                    <span key={ind}>{cat.title}</span>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex ">
                                                        <div className="font-bold w-48">Price:</div>
                                                        <div className="flex items-center">
                                                            <div className="me-3 font-bold">Npr.{detail.afterDiscount}</div>
                                                            {
                                                                detail.discount > 0 && (
                                                                    <div className="flex items-center">
                                                                        <del className="text-red-500 me-2">Npr.{detail.price}</del>
                                                                        <span className="text-red-500">(-{detail.discount}% Off)</span>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex">
                                                        <div className="font-bold w-48">Attributes:</div>
                                                        <div>
                                                            {
                                                                detail.attributes && detail.attributes.map((attr, ind) => (
                                                                    <div className="mb-2 flex" key={ind}>
                                                                        <div className="font-bold w-32">{attr.name}</div>
                                                                        <div>
                                                                            {attr.value && attr.value.map((val, index) => (
                                                                                <span key={index}>{val},</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex">
                                                        <div className="font-bold w-48">Rating:</div>
                                                        <div className="text-amber-500 flex items-center gap-1 mb-5">
                                                            <FaStar />
                                                            <FaStar />
                                                            <FaStar />
                                                            <FaStar />
                                                            <FaStarHalf />
                                                            <FaStarHalf />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex gap-5">
                                                        <input
                                                            type={'number'}
                                                            className=" w-32 h-8 rounded border text-center"
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

                                                        <span className="text-red-500">{qtyErr}</span>
                                                        <div>
                                                            <button onClick={addToCart} disabled={qtyErr ? true : false}
                                                                className="h-10 w-24 mb-3 bg-yellow-500 hover:bg-yellow-600 transition-all text-white rounded-full " type="button">Add to Cart</button>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 flex ">
                                                        <div className="font-bold w-48">Description:</div>
                                                        <div>{detail.description}</div>
                                                    </div>
                                                </div>
                                                <div className="gap-4">


                                                </div>
                                            </>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" container text-xl font-bold mt-16 ml-16 mb-8 text-blue-600" >Recommended Products:</div>
            <div >
                {
                    related && related.map((singleRel, ind) => (
                        <div className=" ml-16 mr-16 mb-8 w-10" key={ind}>
                            <SingleProduct product={singleRel} />
                        </div>
                    ))
                }
            </div>

        </>
    );

};

export default ProductDetail;


import { configureStore } from "@reduxjs/toolkit"
// import cartReducer from "./reducers/cart.reducer"
import userReducer, { clearImage, setImage } from "../reducers/user.reducer"
const store = configureStore({
    reducer: {
        User: userReducer,
        Image: setImage,
        removeImage:clearImage
        // Cart:cartReducer
    }
})
export default store
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authsvc from "../pages/cms/servicepage/auth.service";


export const getLoggedInUser = createAsyncThunk(
    "User/getLoggedInUser",
    async (data, thunkAPI) => {
        try {
            const loggedInuser = await Authsvc.getLoggedInUserDetail()
            localStorage.setItem("_ud", JSON.stringify({ userId: loggedInuser.result._id, name: loggedInuser.result.name, role: loggedInuser.result.role, image: loggedInuser.result.image }))
            return loggedInuser.result
        } catch (exception) {
            throw exception
        }
    }
)

const UserSlicer = createSlice({
    name: "User",
    initialState: {
        user: null,
        image: null
    },
    reducers: {
        sayHello: (state, action) => {
            console.log(action)

        },
        setLoggedInUser: (state, action) => {
            state.user = action.payload
        },
        setImage: (state, action) => {
            state.image = action.payload
        },
        clearImage: (state) => {
            state.image = null
        }


    },
    extraReducers: (builder) => {
        builder.addCase(getLoggedInUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.image = action.payload.image
            console.log(state.user)
        })
        builder.addCase(getLoggedInUser.rejected, (state, action) => {
            localStorage.removeItem("_au")
            localStorage.removeItem("_ud")
            state.user = null
            state.image = null
        })
    }
})
export const { sayHello, setLoggedInUser,setImage,clearImage } = UserSlicer.actions;
export default UserSlicer.reducer
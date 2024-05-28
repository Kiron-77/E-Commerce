const express = require('express');
const app = express();
const cors = require("cors")
require('./db.config')
const router = require('../routes/router')

// const errorRoutes = require('./error.config')
app.use(cors())
// body parser
app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

app.use("/asset/",express.static('./public/uploads'))

// routes
app.use('/api/v1/',router)
app.use((req,res,next)=>{
    next({code:404, message:"Route not  found"})
})
app.use((error, req, res, next) => {
    console.error('Error:', error);

    // Determine the status code to use in the response
    let statusCode = error.status || 500; // Default to 500 if no status is provided
    if (!isValidStatusCode(statusCode)) {
        statusCode = 500; // Set to 500 if the provided status is invalid
    }

    // Set the appropriate status code in the response
    res.status(statusCode);

    // Send the error message as JSON
    res.json({
        message: error.message || 'Internal Server Error'
    });
});

// Helper function to check if a status code is valid
function isValidStatusCode(statusCode) {
    return statusCode >= 100 && statusCode < 600;
}

/******Error handlling middleware ****/
app.use((error,req,res,next)=>{
    console.log('Garbage',error)
    const code = error.code ?? 500;
    const message = error.message ?? "server error"
    const result = error.result ?? null
    res.status(code).json({
        result:result,
        message:message,
        meta:null
    })
})
// app.use(errorRoutes);
module.exports=app;






    

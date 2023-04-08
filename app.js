const express = require("express");
const bodeyParser = require("body-parser");
const HttpError = require("./modal/http-error");
const placesRoute  = require("./routes/place-routes")
const userRoute  = require("./routes/user-routes")
const app = express();
app.use(bodeyParser.json())

app.use("/api/places",placesRoute)
app.use("/api/user",userRoute)

app.use((req,res,next)=>{
    const error =new HttpError("Not found any route",404);
    throw error;
})

app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || "An unknow error occured"})
})

app.listen(5000)
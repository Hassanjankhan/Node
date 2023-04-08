const HttpError = require("../modal/http-error")
const { validationResult } = require("express-validator")

const { v4: uuidv4 } = require('uuid');

const DummyUser = [
    {
        id: uuidv4(),
        name: 'Hassan',
        email: 'hassan@gmail.com',
        pass: "Test@123"
    }
]

const getUsers = (req, res, next) => {
    res.status(200).json(DummyUser)
};

const signUpUser = (req, res, next) => {
   const isError =  validationResult(req);
   if(!isError.isEmpty()){
     throw new HttpError("Please check your data",404)
   }
    const { name, email, pass } = req.body;

    const hasUser = DummyUser.find(obj=>obj.email==email);

    if(hasUser){
        return next(new HttpError("User already exist", 400))

    }
    const createUser = {
        name,
        email,
        pass,
        id: uuidv4()
    }
    DummyUser.push(createUser);
    res.status(201).json({ ...createUser,"message":"user created"})

}

const loginUser = (req, res, next) => {

}


exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
const HttpError = require("../modal/http-error")
const { validationResult } = require("express-validator")
const User = require("../modal/user")
const { v4: uuidv4 } = require('uuid');

const DummyUser = [
    {
        id: uuidv4(),
        name: 'Hassan',
        email: 'hassan@gmail.com',
        pass: "Test@123"
    }
]

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password")
    } catch (error) {
        return new HttpError("User fetch error", 204)
    }
    res.status(200).json({ "users": users.map(value => value.toObject({ getters: true })) })
};

const signUpUser = async (req, res, next) => {
    const isError = validationResult(req);
    if (!isError.isEmpty()) {
        throw new HttpError("Please check your data", 404)
    }
    const { email, pass, } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });

    } catch (erro) {
        const error = new HttpError("Sign Up error please try agian", 500)
        next(error)
        return;

    }
    if (existingUser) {
        return next(new HttpError("User Already Existing", 200));

    }
    const createUser = new User({
        name: name,
        email,
        image: 'https://picsum.photos/200/300',
        password: pass,
        place
    })
    try {
        await createUser.save();
    } catch (er) {
        return next(new HttpError("User Not Save in Db", 500))
    }

    res.status(201).json({ user: createUser.toObject({ getters: true }), "message": "user created" })

}

const loginUser = async (req, res, next) => {
    const { name, email, pass, image, place } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });

    } catch (erro) {
        const error = new HttpError("Login error please try again latter", 500)
        next(error)
        return;

    }
    if (!existingUser || existingUser.password != pass) {
        return next(new HttpError("Invalid Cridental Please Try Agian", 200));

    }
    res.status(200).json({ "message": "Login successfully", "user": existingUser })
}


exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
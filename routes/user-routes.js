const express = require("express")
const { check } = require("express-validator")
const HttpError = require("../modal/http-error")
const router = express.Router();
const userController = require("../controller/user-controller")

router.get("/", userController.getUsers)
router.post("/login", userController.loginUser)
router.post("/signup",
    [
        check("email").normalizeEmail().isEmail(),
        check("name").not().isEmpty(),
        check("pass").isLength({ min: 8 })

    ]
    , userController.signUpUser)

module.exports = router;
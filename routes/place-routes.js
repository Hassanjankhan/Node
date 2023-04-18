const express = require("express")
const { check } = require("express-validator")
const HttpError = require("../modal/http-error")
const router = express.Router();

const placeControll = require("../controller/places-controller")

router.get("/:pid", placeControll.getPlaceById)
router.get("/user/:uid", placeControll.getPlaceByUserId)
router.post("/",
    [
        check("title").not().isEmpty(),
        check("address").not().isEmpty(),
        check("description").isLength({ min: 5 })
    ],
    placeControll.createPlace)
router.get("/", placeControll.getPlace)
router.patch("/users/:pid",
    [
        check("title").not().isEmpty(),
        check("address").not().isEmpty(),
        check("description").isLength({ min: 5 })
    ]
    ,
    placeControll.update);
router.delete("/:pid", placeControll.deletePlace)
module.exports = router;
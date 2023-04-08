
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator")

const HttpError = require("../modal/http-error")

let Dummy_Places = [
    {
        id: "pi",
        title: "Empire State Building",
        description: "A quick brown fox jumps over the lazy dog",
        location: {
            lat: 198.33,
            long: 3422.43
        },
        address: "20 m w20 ",
        creator: "m2"
    }
]
const getPlaceById = (req, resp, next) => {
    console.log("Get Request in Places");
    const placeId = req.params.pid;
    const placeObject = Dummy_Places.find(object => {
        return object.id == placeId;
    })
    if (!placeObject) {
        return next(new HttpError("An Error Occure ", 400))
    }
    resp.json(placeObject)
}

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const placeCreater = Dummy_Places.find(obj => {
        return obj.creator == userId;
    })

    if (!placeCreater) {
        return next(new HttpError("Could not find a user.", 400))
    }
    res.json({ placeCreater })
}

const createPlace = (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        console.log(error)
        throw new HttpError("Invalid inputs passed, please check you'r data", 422)
    }

    const { title, address, description, coordinate } = req.body;
    let object = {
        id: uuidv4(),
        title,
        address,
        description,
        location: coordinate
    }
    Dummy_Places.push(object);
    res.status(201).json({ place: object })
}
const getPlace = (req, res, next) => {

    res.status(200).json(Dummy_Places)
}
const update = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error)
        throw new HttpError("Invalid inputs passed, please check you'r data", 422)
    }
    const { title, adddress } = req.body;
    const pid = req.params.pid;
    const itemObject = { ...Dummy_Places.find(obj => obj.id == pid) }

    const itemIndext = Dummy_Places.findIndex(p => p.id == pid);

    itemObject.title = title;
    itemObject.address = adddress;

    Dummy_Places[itemIndext] = itemObject;

    res.status(200).json({ places: itemObject })
}

const deletePlace = (req, res, next) => {
    const deleteId = req.params.pid;
    if(!Dummy_Places.find(ob => ob.id == deleteId)){
        throw new HttpError("Place does not exist",404)
    }
    Dummy_Places = Dummy_Places.filter(ob => ob.id !== deleteId);

    res.status(200).json({ "message": "Record delete successfully" })
}
exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
exports.getPlace = getPlace
exports.update = update
exports.deletePlace = deletePlace
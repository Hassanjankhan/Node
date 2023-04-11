
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator")

const Place = require("../modal/place")
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
const getPlaceById = async (req, resp, next) => {
    let placeId = req.params.pid;
    let placeObject = null;
    console.log("Get Request in Places", placeId);

    try {
        placeObject = await Place.findById(placeId)

    } catch (error) {
        console.log(error)
        const dbError = new HttpError("Something went wrong, could not find place", 500)
        return next(dbError)
    }
    if (!placeObject) {
        return next(new HttpError("An Error Occure ", 400))
    }
    resp.json(placeObject)
}

const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let placeCreater = null
    try {
        placeCreater = await Place.find({ creator: userId })
    } catch (error) {
        return next(new HttpError("Some thing went wrong fetching places failed.", 500))

    }


    if (!placeCreater) {
        return next(new HttpError("Could not find a place agint the user.", 400))
    }
    res.json({ placeCreater: placeCreater.map(place => place.toObject({ gatters: true })) })
}

const createPlace = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        console.log(error)
        throw new HttpError("Invalid inputs passed, please check you'r data", 422)
    }

    const { title, address, description, coordinate, creator } = req.body;

    let object = new Place({
        title,
        address,
        description,
        location: coordinate,
        image: 'https://picsum.photos/200/300',
        creator
    })
    try {
        await object.save()
    } catch (error) {
        console.log(error)
        throw new HttpError("Creating place error please try agian", 500);
    }
    res.status(201).json({ place: object })
}
const getPlace = async (req, res, next) => {
    let array = []
    try {
        array = await Place.find()

    } catch (e) {
        throw new HttpError("Place have some error", 500)
    }
    res.status(200).json(array)
}
const update = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error)
        throw new HttpError("Invalid inputs passed, please check you'r data", 422)
    }
    const { title, adddress, description } = req.body;
    const pid = req.params.pid;
    let placeObject = null
    try {
        placeObject = await Place.findById(pid);

    } catch (error) {
        console.log(error)
        throw new HttpError("Place not found", 422)

    }

    placeObject.title = title;
    placeObject.address = adddress;
    placeObject.description = description

    try {
        placeObject.save()
    } catch (err) {
        console.log(err)
        throw new HttpError("Place not saved", 422)

    }

    res.status(200).json({ places: placeObject.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
    const deleteId = req.params.pid;
    let place = null;
    console.log("delete id", deleteId)

    try {
        // place = await Place.deleteOne({ "_id": deleteId });
        // console.log(place)

        place = await Place.findByIdAndRemove(deleteId, req.body, function (err, docs) {
            if (!err) {
                console.log(docs);
            }
            else {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err)
        const e = new HttpError("Could not found item in db", 500)
        return next(e)
    }
    res.status(200).json({ "message": "Record delete successfully" })
}
exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
exports.getPlace = getPlace
exports.update = update
exports.deletePlace = deletePlace
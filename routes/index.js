const express   = require("express");
const router    = express.Router();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const Stat = require("../models/index").Stat;
const Activity = require("../models/index").Activity;


router.get("/", passport.authenticate('basic', {session: false}), function(req, res){
    res.send("StatTracker Home!")
})
// GET	/activities	Show a list of all activities I am tracking, and links to their individual pages
router.get('/activities', passport.authenticate('basic', {session: false}), function(req, res){

    Activity.findAll({

        include: [
            {
                model: Stat,
                as: "stats"
            }
        ]
    })
    .then(function(data){
        res.send(data);
    })
});

// POST	/activities	Create a new activity for me to track.

router.post("/activities", function(req, res){

    Activity.create({
        name: req.body.name,
        unit: req.body.unit
    })
    .then(function(data){
        res.send(data)
    })
})


// GET	/activities/{id}	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
router.get('/activities/:id', function(req, res){
    let activityId = req.params.id;

    Activity.findById(activityId)
    .then(function(data){
        res.send(data)
    })
});


// PUT	/activities/{id}	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.

router.put('/activities/:id', function(req, res){
    let activityId = req.params.id;

        Activity.update({
            name: req.body.name,
            unit: req.body.unit
        },{
            where: {
                id: activityId
            }
        })
        .then(function(data){
            res.send(data)
        })
});


// DELETE	/activities/{id}	Delete one activity I am tracking. This should remove tracked data for that activity as well.

router.delete("/activities/:id", function(req,res){
    let activityId = req.params.id

    Stat.destroy({
        where: {
            activityId: activityId
        }
    })
    .then(statDestroy=>{
        Activity.destroy({
            where: {
                id: activityId
            }
        })
        .then(function(data){
            console.log("this is the data that I am logging", data);
            res.json(" activity has been destroyed")
        })
        .catch(function(activityErr){
            res.json(activityErr)
        })
    })
    .catch(err=>{
        res.json(err)
    })

    // Activity.destroy({
    //     where: {
    //         id: activityId
    //     }
    // })
    // .then(function(data){
    //     console.log("this is the data that I am logging", data);
    //     res.json(data, " activity has been destroyed")
    // })
    // .catch(function(activityErr){
    //     res.send(activityErr)
    // })

    //this will be inside a destroy for all the stats where activityId: activityId, .then this^ then the stats should have a .catch(function(statErr){res.send("Stat Error", statErr)})
});


// POST	/activities/{id}/stats	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.

router.post("/activities/:id/stats", function(req, res){
    let activityId = req.params.id;

    Stat.create({
        activityId: activityId,
        measurement: req.body.measurement
    })
    .then(data=>{
        res.send(data)
    })
});

// DELETE	/stats/{id}	Remove tracked data for a day.

router.delete("/stats/:id", function(req, res){

    let statId = req.params.id;

    Stat.destroy({
        where: {
            id: statId
        }
    })
    .then(data=>{
        res.json(data)
    })

})




module.exports = router;
// *   Trying ::1...
// * Connected to localhost (::1) port 3000 (#0)
// * Server auth using Basic with user 'imani'
// > GET /auth HTTP/1.1
// > Host: localhost:3000
// > Authorization: Basic aW1hbmk6cGFzc3dvcmQ=
// > User-Agent: curl/7.49.1
// > Accept: */*
// >
// < HTTP/1.1 200 OK
// < X-Powered-By: Express
// < Content-Type: application/json; charset=utf-8
// < Content-Length: 17
// < ETag: W/"11-e60VPuUKl6PRNUb8SnRuGpASlnQ"
// < Date: Wed, 06 Sep 2017 15:40:14 GMT
// < Connection: keep-alive
// <
// * Connection #0 to host localhost left intact
// {"hello":"imani"}%

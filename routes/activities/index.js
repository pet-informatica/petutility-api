const path = require('path');
const app = require(path.join(__dirname, '../../index')).app;
const router = require('express').Router();
const Activity = app.get('models').Activity;

router.get('/', (req, res) => {
    Activity
        .findAll()
        .then(activities => res.status(200).json(activities))
        .catch(err => res.status(500).send('Internal server error'));
});

router.get('/:activityId', (req, res) => {
    Activity
        .findById(req.params.activityId)
        .then(activity => res.status(200).json(activity))
        .catch(err => res.status(500).send('Internal server error'));
});

router.post('/', (req, res) => {
    Activity
        .create({
            Title: req.body.Title,
            Start: req.body.Start,
            End: req.body.End,
            Participants: req.body.Participants,
            Positive: req.body.Positive,
            Negative: req.body.Negative,
            Comments: req.body.Comments,
            PETianoId: req.user.Id
        })
        .then(event => res.status(201).json(event))
        .catch(err => res.status(500).send('Internal server error'));
});

// ????
router.put('/:activityId', (req, res) => {
    Activity
        .update({
            Title: req.body.Title,
            Start: req.body.Start,
            End: req.body.End,
            Participants: req.body.Participants,
            Positive: req.body.Positive,
            Negative: req.body.Negative,
            Comments: req.body.Comments
        },
        {
            where: {
                Id: req.params.activityId
            },
            returning: true
        })
        .then(activity => res.status(200).json(activity[1][0]))
        .catch(err => res.status(500).send('Internal server error'));
});

// ????
router.delete('/:activityId', (req, res) => {
    Activity
        .destroy({ where: {
            Id: req.params.activityId
        }})
        .then(result => res.end())
        .catch(err => res.status(500).send('Internal server error'));
});

module.exports = router;

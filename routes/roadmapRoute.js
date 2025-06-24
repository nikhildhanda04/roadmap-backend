const express = require('express');
const router = express.Router();
const { createRoadmap, getRoadmaps, getRoadmap, updateRoadmap, deleteRoadmap } = require('../controllers/roadmapController');
const validateTokenHandler = require("../middleware/validateTokenHandler");

router.use(validateTokenHandler); // Protect all routes below

router.route('/create').post(createRoadmap);
router.route("/").get(getRoadmaps);
router.route('/:id').get(getRoadmap).put(updateRoadmap).delete(deleteRoadmap);

module.exports = router;
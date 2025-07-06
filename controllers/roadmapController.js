const asyncHandler = require("express-async-handler");
const Roadmap = require("../models/roadmapModel");
const axios = require("axios");



// @desc Create a new roadmap
// @route POST /api/roadmap/create  
// @access Private
const createRoadmap = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

const prompt = `
Generate ONLY valid JSON, no extra text.

Create a learning roadmap for the topic: "${title}".
It must have this exact structure:

{
  "beginner": [
    {
      "title": "Step title",
      "description": "Brief description",
      "content": ["Point 1", "Point 2"],
      "prerequisites": ["Optional prerequisite"]
    }
  ],
  "intermediate": [
    {
      "title": "Step title",
      "description": "Brief description",
      "content": ["Point 1", "Point 2"],
      "prerequisites": ["Optional prerequisite"]
    }
  ],
  "advanced": [
    {
      "title": "Step title",
      "description": "Brief description",
      "content": ["Point 1", "Point 2"],
      "prerequisites": ["Optional prerequisite"]
    }
  ]
}

Do not include any explanations or text before or after the JSON.
Output must be valid JSON.
`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3.2:1b",
      prompt: prompt,
      stream: false
    });

    const cleaned = response.data.response.trim();

    // Try parsing the returned string as JSON
    let roadmapJSON;
    try {
      roadmapJSON = JSON.parse(cleaned);
    } catch (e) {
      // If response contains extra text, extract JSON using regex
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      roadmapJSON = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!roadmapJSON) {
      return res.status(500).json({ message: 'Could not extract roadmap from response' });
    }

    const newRoadmap = await Roadmap.create({
      title,
      data: roadmapJSON,
      user: req.user._id // Associate roadmap with authenticated user
    });

    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error("Ollama/DeepSeek error:", error.message);
    res.status(500).json({ message: "Error generating roadmap" });
  }
});

// @route GET /api/roadmap
// @access Private
const getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id });
  res.status(200).json(roadmaps);
});


// @desc get a  roadmap
// @route GET /api/roadmap/:id 
// @access Private
const getRoadmap = asyncHandler(async (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Details of roadmap with ID: ${id}` });
});


// @route PUT /api/roadmap/:id
// @access Private
const updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);

  if (!roadmap || roadmap.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  roadmap.title = req.body.title || roadmap.title;
  roadmap.data = req.body.data || roadmap.data;
  const updated = await roadmap.save();

  res.status(200).json(updated);
});


// @route DELETE /api/roadmap/:id
// @access Private
const deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);

  if (!roadmap || roadmap.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await roadmap.remove();
  res.status(200).json({ message: 'Roadmap deleted' });
});


module.exports = {
    createRoadmap,
    getRoadmaps,
    getRoadmap,
    updateRoadmap,
    deleteRoadmap
};  
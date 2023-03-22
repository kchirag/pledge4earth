const express = require('express');
const router = express.Router();
//const View = require('../models/View');
const UserView = require('../models/UserView');

router.get('/', async (req, res) => {
  try {
    const views = await UserView.find();
    res.json(views);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

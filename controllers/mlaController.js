const MLA = require('../models/MLA');

exports.getAllMLAs = async (req, res) => {
  try {
    const mlas = await MLA.find().select('-reviews');
    res.json(mlas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMLAsByState = async (req, res) => {
  try {
    const { state } = req.params;
    const mlas = await MLA.find({ state }).select('-reviews');
    res.json(mlas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
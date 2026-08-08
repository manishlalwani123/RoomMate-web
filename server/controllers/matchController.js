const User = require('../models/User');
const computeCompatibility = require('../utils/compatibility');

// GET /api/matches — ranked list of other users by compatibility score
exports.getMatches = async (req, res) => {
  const me = req.user;

  const others = await User.find({
    _id: { $ne: me._id },
    onboardingComplete: true,
  });

  const ranked = others
    .map((other) => ({ user: other, score: computeCompatibility(me, other) }))
    .sort((a, b) => b.score - a.score);

  res.json(ranked);
};

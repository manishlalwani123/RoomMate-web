const User = require('../models/User');

// PUT /api/users/personal-info
exports.updatePersonalInfo = async (req, res) => {
  const { department, yearOfStudy, phone, gender, dob, district, state } =
    req.body;

  req.user.personalInfo = {
    department,
    yearOfStudy: yearOfStudy ? Number(yearOfStudy) : undefined,
    phone,
    gender,
    dob: dob ? new Date(dob) : undefined,
    district,
    state,
  };

  await req.user.save();
  res.json(req.user);
};

// PUT /api/users/room-preferences
exports.updateRoomPreferences = async (req, res) => {
  const {
    accommodationType,
    preferredLocation,
    rentBudget,
    numRoommates,
    bhk,
    amenities,
  } = req.body;

  req.user.roomPreferences = {
    accommodationType,
    preferredLocation,
    rentBudget: rentBudget ? Number(rentBudget) : undefined,
    numRoommates: numRoommates ? Number(numRoommates) : undefined,
    bhk: bhk ? Number(bhk) : undefined,
    amenities: Array.isArray(amenities) ? amenities : [],
  };

  await req.user.save();
  res.json(req.user);
};

// PUT /api/users/roommate-preferences
exports.updateRoommatePreferences = async (req, res) => {
  const { department, yearOfStudy, sleepSchedule, gender, state } = req.body;

  req.user.roommatePreferences = {
    department,
    yearOfStudy: yearOfStudy ? Number(yearOfStudy) : undefined,
    sleepSchedule,
    gender,
    state,
  };

  await req.user.save();
  res.json(req.user);
};

// PUT /api/users/profile  (multipart/form-data)
exports.updateProfile = async (req, res) => {
  const { introduction } = req.body;

  req.user.profile = req.user.profile || {};
  req.user.profile.introduction = introduction;

  if (req.file) {
    req.user.profile.pictureUrl = `/uploads/${req.file.filename}`;
  }

  req.user.onboardingComplete = true;

  await req.user.save();
  res.json(req.user);
};

// GET /api/users  (everyone except me, for the browse page)
exports.listUsers = async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.user._id },
    onboardingComplete: true,
  }).select(
    'fullname email personalInfo profile.pictureUrl roomPreferences.preferredLocation'
  );

  res.json(users);
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

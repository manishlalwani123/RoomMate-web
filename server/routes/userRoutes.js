const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  updatePersonalInfo,
  updateRoomPreferences,
  updateRoommatePreferences,
  updateProfile,
  listUsers,
  getUserById,
} = require('../controllers/userController');

router.use(protect);

router.get('/', listUsers);
router.put('/personal-info', updatePersonalInfo);
router.put('/room-preferences', updateRoomPreferences);
router.put('/roommate-preferences', updateRoommatePreferences);
router.put('/profile', upload.single('profilePicture'), updateProfile);
router.get('/:id', getUserById);

module.exports = router;

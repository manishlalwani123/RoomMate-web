const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: true },

    personalInfo: {
      department: String,
      yearOfStudy: Number,
      phone: String,
      gender: String,
      dob: Date,
      district: String,
      state: String,
    },

    roomPreferences: {
      accommodationType: String,
      preferredLocation: String,
      rentBudget: Number,
      numRoommates: Number,
      bhk: Number,
      amenities: [String],
    },

    // Modeled as the user's own habits/traits so matching can compare
    // "my roommate preferences" directly against another user's.
    roommatePreferences: {
      department: String,
      yearOfStudy: Number,
      sleepSchedule: String,
      gender: String,
      state: String,
    },

    profile: {
      introduction: String,
      pictureUrl: String,
    },

    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Never leak the password hash in API responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

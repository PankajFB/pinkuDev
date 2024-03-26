const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
});

// Hash the password before saving
userSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it's been modified or is new
  if (!user.isModified("password")) {
    return next();
  }

  // Generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // Hash the password with the new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // Override the plain text password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Method to compare a password
userSchema.methods.comparePassword = function (userPassword, callback) {
  const hashedPassword = String(this.password); // Ensure this.password is a string
  const providedPassword = String(userPassword); // Ensure userPassword is a string

  return bcrypt.compare(providedPassword, hashedPassword);
};

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;

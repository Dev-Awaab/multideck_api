import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter a name'],
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'Enter a vaild email'],
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
    },
    role: {
      type: String,
      enum: ['pulisher', 'user'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign jwt token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and has password for reset
UserSchema.methods.getResetPasswordToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    // set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
};
const User = mongoose.model('User', UserSchema);

export default User;

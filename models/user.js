const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a name.'],
    unique: [true, 'Must be unique.'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password.'],
    minlength: 5,
    select: false
  }
}, {
    timestamps: true
});



// Encrypt password using bcrypt
UserSchema.pre("save", async function(next) {
    const user = this

    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})


UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}



module.exports = mongoose.model('User', UserSchema);

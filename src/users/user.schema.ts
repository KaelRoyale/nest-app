import * as bcrypt from "bcrypt"
import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
  created: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true},
  failedAttemps: { type: Number, default: 0}
});

UserSchema.pre('save', function(next){

  let user = this;
  // Make sure not to rehash the password if it is already hashed
  if(!user.isModified('password')) return next();
  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (err, salt) => {

      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if(err) return next(err);
          user.password = hash;
          next();
      });
  });
}); 
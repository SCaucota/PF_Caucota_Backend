import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    resetToken: {
        token: String,
        expire: Date
    },
    documents: [
        {
            name: {
                type: String,
                required: true
            },
            reference: {
                type: String,
                required: true
            }
        }
    ],
    last_connection: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("findOne", function(next) {
    this.populate("cart");
    next();
})

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const cooSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: 'Operations'
    },
    image: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'coo'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt field on save
cooSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Encrypt password using bcrypt
cooSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user entered password to hashed password in database
cooSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Coo = mongoose.model('Coo', cooSchema);

export default Coo; 
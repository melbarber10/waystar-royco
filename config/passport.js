import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Coo from '../models/cooModel.js';
import Employee from '../models/employeeModel.js';
import Dh from '../models/dhModel.js';

// Employee Strategy
passport.use('employee', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        const isMatch = await employee.matchPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, employee);
    } catch (error) {
        return done(error);
    }
}));

// Department Head Strategy
passport.use('dh', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const dh = await Dh.findOne({ email });
        if (!dh) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        const isMatch = await dh.matchPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, dh);
    } catch (error) {
        return done(error);
    }
}));

// COO Strategy
passport.use('coo', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const coo = await Coo.findOne({ email }).select('+password');
        if (!coo) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        const isMatch = await coo.matchPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, coo);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.constructor.modelName.toLowerCase() });
});

// Deserialize user
passport.deserializeUser(async (userData, done) => {
    try {
        let user;
        switch (userData.role) {
            case 'employee':
                user = await Employee.findById(userData.id);
                break;
            case 'dh':
                user = await Dh.findById(userData.id);
                break;
            case 'coo':
                user = await Coo.findById(userData.id);
                break;
            default:
                return done(new Error('Invalid user role'));
        }
        
        if (!user) {
            return done(null, false);
        }
        
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;

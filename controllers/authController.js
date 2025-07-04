import Employee from "../models/employeeModel.js";  
import Dh from "../models/dhModel.js";               
import Coo from "../models/cooModel.js";            
import { validationResult } from "express-validator"; 
import passport from 'passport';
import bcrypt from 'bcryptjs';

export const showRegisterForm = (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
};

export const registerUser = async (req, res) => {
    try {
        console.log('Registration request received:', {
            body: req.body,
            file: req.file
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/auth/register');
        }

        const { name, email, password, role, phoneNumber, department } = req.body;
        
        console.log('Processing registration for:', {
            name,
            email,
            role,
            phoneNumber,
            department
        });

        let existingUser;
        switch (role) {
            case 'employee':
                existingUser = await Employee.findOne({ email });
                break;
            case 'dh':
                existingUser = await Dh.findOne({ email });
                break;
            case 'coo':
                existingUser = await Coo.findOne({ email });
                break;
            default:
                console.log('Invalid role selected:', role);
                req.flash('error', 'Invalid role selected');
                return res.redirect('/auth/register');
        }

        if (existingUser) {
            console.log('User already exists:', email);
            req.flash('error', 'Email already registered');
            return res.redirect('/auth/register');
        }

        let newUser;
        const userData = {
            name,
            email,
            password, 
            phoneNumber,
            department,
            image: req.file ? `/uploads/${req.file.filename}` : null
        };

        console.log('Creating new user with data:', {
            ...userData,
            password: '[HIDDEN]'
        });

        switch (role) {
            case 'employee':
                newUser = new Employee(userData);
                break;
            case 'dh':
                newUser = new Dh(userData);
                break;
            case 'coo':
                newUser = new Coo(userData);
                break;
        }

        await newUser.save();
        console.log('User created successfully:', {
            id: newUser._id,
            email: newUser.email,
            role: role
        });
        
        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/auth/register');
    }
};

export const showLoginForm = (req, res) => {
    res.render('auth/login', { 
        title: 'Login',
        messages: {
            error: req.flash('error')
        }
    });
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have been logged out');
        res.redirect('/');
    });
};

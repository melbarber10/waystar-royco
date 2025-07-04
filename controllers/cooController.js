import Coo from '../models/cooModel.js';
import Employee from '../models/employeeModel.js';
import Leave from '../models/leaveModel.js';
import Dh from '../models/dhModel.js';

// Get COO Dashboard
export const getCooDashboard = async (req, res) => {
    try {
        const pendingLeaves = await Leave.find({ coostatus: 'pending' }).count();
        const totalEmployees = await Employee.countDocuments();
        const approvedLeaves = await Leave.find({ coostatus: 'approved' }).count();
        const deniedLeaves = await Leave.find({ coostatus: 'denied' }).count();

        res.render('coo/dashboard', {
            title: 'COO Dashboard',
            user: req.user,
            pendingLeaves,
            totalEmployees,
            approvedLeaves,
            deniedLeaves,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading dashboard');
        res.redirect('/coo/profile');
    }
};

// Get COO Profile
export const getCooProfile = async (req, res) => {
    try {
        const coo = await Coo.findById(req.user._id);
        res.render('coo/profile', {
            title: 'COO Profile',
            user: coo,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading profile');
        res.redirect('/coo/dashboard');
    }
};

// Update COO Profile
export const updateCooProfile = async (req, res) => {
    try {
        const { name, phoneNumber, bio } = req.body;
        const coo = await Coo.findById(req.user._id);

        // Update basic fields
        coo.name = name;
        if (phoneNumber) coo.phoneNumber = phoneNumber;
        if (bio) coo.bio = bio;

        // Handle profile image upload
        if (req.file) {
            coo.image = `/uploads/${req.file.filename}`;
        }

        await coo.save();

        req.flash('success', 'Profile updated successfully');
        res.redirect('/coo/profile');
    } catch (error) {
        console.error('Profile update error:', error);
        req.flash('error', 'Error updating profile');
        res.redirect('/coo/profile');
    }
};

// Get Pending Leaves
export const getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ finalStatus: 'pending' })
            .populate('employeeLeave', 'name email department')
            .sort({ createdAt: -1 });

        res.render('coo/pendingLeaves', {
            title: 'Pending Leaves',
            user: req.user,
            leaves,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading pending leaves');
        res.redirect('/coo/dashboard');
    }
};

// Approve Leave
export const approveLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            req.flash('error', 'Leave request not found');
            return res.redirect('/coo/leave/pending');
        }

        leave.finalStatus = 'approved';
        await leave.save();

        req.flash('success', 'Leave request approved');
        res.redirect('/coo/leave/pending');
    } catch (error) {
        req.flash('error', 'Error approving leave request');
        res.redirect('/coo/leave/pending');
    }
};

// Deny Leave
export const denyLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            req.flash('error', 'Leave request not found');
            return res.redirect('/coo/leave/pending');
        }

        leave.finalStatus = 'denied';
        await leave.save();

        req.flash('success', 'Leave request denied');
        res.redirect('/coo/leave/pending');
    } catch (error) {
        req.flash('error', 'Error denying leave request');
        res.redirect('/coo/leave/pending');
    }
};

// Get Leave History
export const getLeaveHistory = async (req, res) => {
    try {
        const leaves = await Leave.find({ finalStatus: { $ne: 'pending' } })
            .populate('employeeLeave', 'name email department')
            .sort({ updatedAt: -1 });

        res.render('coo/leaveHistory', {
            title: 'Leave History',
            user: req.user,
            leaves,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading leave history');
        res.redirect('/coo/dashboard');
    }
};

// Get Employee List
export const getEmployeeList = async (req, res) => {
    try {
        const employees = await Employee.find()
            .select('name email department position')
            .sort({ name: 1 });

        res.render('coo/employeeList', {
            title: 'Employee List',
            employees,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading employee list');
        res.redirect('/coo/dashboard');
    }
};

// Get Employee Details
export const getEmployeeDetails = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            req.flash('error', 'Employee not found');
            return res.redirect('/coo/employees');
        }

        const leaves = await Leave.find({ employee: employee._id })
            .sort({ createdAt: -1 });

        res.render('coo/employeeDetails', {
            title: 'Employee Details',
            employee,
            leaves,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading employee details');
        res.redirect('/coo/employees');
    }
};

// Get Department Heads List
export const getDepartmentHeads = async (req, res) => {
    try {
        const departmentHeads = await Dh.find()
            .select('name email department')
            .sort({ department: 1 });

        res.render('coo/departmentHeads', {
            title: 'Department Heads',
            user: req.user,
            departmentHeads,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        req.flash('error', 'Error loading department heads');
        res.redirect('/coo/dashboard');
    }
}; 
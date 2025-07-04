import Employee from '../models/employeeModel.js';
import Leave from '../models/leaveModel.js';
import moment from 'moment';

export const showLoginForm = (req, res) => {
  res.render('auth/employeeLogin', {
    messages: {
      error: req.flash('error'),
      success: req.flash('success')
    }
  });
};

export const getDashboard = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id).populate('leaves');
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }

    // Get leave statistics
    const pendingLeaves = employee.leaves.filter(leave => leave.status === 'pending').length;
    const approvedLeaves = employee.leaves.filter(leave => leave.status === 'approved').length;
    const deniedLeaves = employee.leaves.filter(leave => leave.status === 'denied').length;

    // Get recent leaves
    const recentLeaves = employee.leaves
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    res.render('employee/dashboard', {
      title: 'Dashboard',
      employee,
      pendingLeaves,
      approvedLeaves,
      deniedLeaves,
      recentLeaves,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in getDashboard:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/auth/login');
  }
};

export const employeeHome = async (req, res) => {
  try {
    console.log('User data:', req.user); // Debug log
    const employee = await Employee.findById(req.user._id).populate('leaves');
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }
    res.render('employee/employeeHome', {
      title: 'Employee Dashboard',
      employee,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in employeeHome:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/auth/login');
  }
};

export const showProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }
    res.render('employee/profile', {
      title: 'My Profile',
      employee,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in showProfile:', error);
    req.flash('error', 'Error loading profile');
    res.redirect('/employee/home');
  }
};

export const showEditForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }
    res.render('employee/editEmployee', {
      title: 'Edit Profile',
      employee,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in showEditForm:', error);
    req.flash('error', 'Error loading edit form');
    res.redirect('/employee/profile');
  }
};

export const updateEmployee = async (req, res) => {
  try {
    console.log('Update request received:', req.body);
    console.log('File:', req.file);
    
    const { name, phoneNumber } = req.body;
    const updateData = { name, phoneNumber };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    console.log('Update data:', updateData);

    const employee = await Employee.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      console.log('Employee not found');
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }

    console.log('Employee updated successfully:', employee);
    req.flash('success', 'Profile updated successfully');
    res.redirect('/employee/profile');
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    req.flash('error', error.message || 'Error updating profile');
    res.redirect('/employee/profile/edit');
  }
};

export const showApplyForm = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }
    res.render('employee/applyLeave', {
      title: 'Apply Leave',
      employee,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in showApplyForm:', error);
    req.flash('error', 'Error loading leave application form');
    res.redirect('/employee/home');
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { subject, leaveType, from, to, reason } = req.body;
    const fromDate = moment(from);
    const toDate = moment(to);
    const days = toDate.diff(fromDate, 'days') + 1;

    const leave = new Leave({
      subject,
      leaveType,
      from,
      to,
      days,
      reason,
      employeeLeave: req.user._id,
      status: 'pending'
    });

    await leave.save();

    // Add leave to employee's leaves array
    const employee = await Employee.findByIdAndUpdate(
      req.user._id,
      { $push: { leaves: leave._id } },
      { new: true }
    );

    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }

    req.flash('success', 'Leave application submitted successfully');
    res.redirect('/employee/leave/track');
  } catch (error) {
    console.error('Error in applyLeave:', error);
    req.flash('error', 'Error submitting leave application');
    res.redirect('/employee/leave/apply');
  }
};

export const showTrack = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user._id).populate('leaves');
    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/auth/login');
    }
    res.render('employee/trackLeave', {
      title: 'Track Leave',
      employee,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error('Error in showTrack:', error);
    req.flash('error', 'Error loading leave tracking');
    res.redirect('/employee/home');
  }
};

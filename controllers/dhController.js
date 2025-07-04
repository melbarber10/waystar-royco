import DH from "../models/dhModel.js";
import Employee from "../models/employeeModel.js";
import Leave from "../models/leaveModel.js";
import moment from "moment";

// Show DH login form
export const showLoginForm = (req, res) => {
  res.render('auth/dhLogin', {
    title: 'DH Login',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// Get DH dashboard
export const getDashboard = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    // Get all employees in the department
    const employees = await Employee.find({ department: dh.department });
    const employeeIds = employees.map(emp => emp._id);

    // Get leave statistics
    const pendingLeaves = await Leave.countDocuments({ 
      status: 'pending',
      employeeLeave: { $in: employeeIds }
    });
    const approvedLeaves = await Leave.countDocuments({ 
      status: 'approved',
      employeeLeave: { $in: employeeIds }
    });
    const rejectedLeaves = await Leave.countDocuments({ 
      status: 'denied',
      employeeLeave: { $in: employeeIds }
    });

    // Get recent leaves
    const recentLeaves = await Leave.find({
      employeeLeave: { $in: employeeIds }
    })
    .populate({
      path: 'employeeLeave',
      select: 'name email department image'
    })
    .sort({ createdAt: -1 })
    .limit(5);

    res.render("dh/dashboard", {
      title: 'DH Dashboard',
      dh,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      recentLeaves,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);
    req.flash("error", "Error loading dashboard");
    res.redirect("/auth/login");
  }
};

// Show DH profile
export const showProfile = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/dh/dashboard");
    }
    res.render("dh/profile", { 
      title: 'DH Profile',
      dh,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in showProfile:", error);
    req.flash("error", "Error loading profile");
    res.redirect("/dh/dashboard");
  }
};

// Show edit form
export const showEditForm = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/dh/dashboard");
    }
    res.render("dh/editProfile", { 
      title: 'Edit DH Profile',
      dh,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in showEditForm:", error);
    req.flash("error", "Error loading edit form");
    res.redirect("/dh/dashboard");
  }
};

// Update DH profile
export const updateDH = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    const updateData = { name, phoneNumber };

    // Handle image upload if provided
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const dh = await DH.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/dh/dashboard");
    }

    req.flash("success", "Profile updated successfully");
    res.redirect("/dh/profile");
  } catch (error) {
    console.error("Error in updateDH:", error);
    req.flash("error", "Error updating profile");
    res.redirect("/dh/profile/edit");
  }
};

// View employee leaves for DH
export const viewLeaves = async (req, res) => {
  try {
    const dhFound = await DH.findById(req.params.id);
    if (!dhFound) {
      req.flash("error", "DH not found");
      return res.redirect("back");
    }
    
    const employees = await Employee.find({ department: dhFound.department }).populate("leaves");
    if (!employees) {
      req.flash("error", "Employees not found in your department");
      return res.redirect("back");
    }
    
    res.render("dh/dhLeaveSign", {
      title: 'Employee Leaves',
      dh: dhFound,
      employees: employees,
      moment: moment
    });
  } catch (err) {
    console.error("Error in viewLeaves:", err);
    req.flash("error", "Error loading leaves");
    return res.redirect("back");
  }
};

// View employee leave info
export const viewEmployeeLeaveInfo = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.emp_id);
    if (!employee) {
      req.flash("error", "Employee not found");
      return res.redirect("/dh/leave/pending");
    }

    // Verify employee is in the same department
    if (employee.department !== req.user.department) {
      req.flash("error", "You can only view leaves of employees in your department");
      return res.redirect("/dh/leave/pending");
    }

    const leaves = await Leave.find({ 
      employeeLeave: employee._id,
      status: 'pending'
    }).sort({ createdAt: -1 });

    res.render("dh/leaveInfo", { 
      title: 'Employee Leave Info',
      employee,
      leaves,
      error: req.flash("error"),
      success: req.flash("success")
    });
  } catch (error) {
    console.error("Error in viewEmployeeLeaveInfo:", error);
    req.flash("error", "Error loading employee leave information");
    res.redirect("/dh/leave/pending");
  }
};

// Process leave approval/rejection
export const processEmployeeLeave = async (req, res) => {
  try {
    const dhFound = await DH.findById(req.params.id);
    if (!dhFound) {
      req.flash("error", "DH not found");
      return res.redirect("back");
    }
    
    const foundEmployee = await Employee.findById(req.params.emp_id).populate("leaves");
    if (!foundEmployee) {
      req.flash("error", "Employee not found");
      return res.redirect("back");
    }
    
    if (req.body.action === "Approve") {
      for (const leave of foundEmployee.leaves) {
        if (leave.status === "pending") {
          leave.status = "approved";
          leave.approved = true;
          await leave.save();
        }
      }
    } else {
      for (const leave of foundEmployee.leaves) {
        if (leave.status === "pending") {
          leave.status = "denied";
          leave.denied = true;
          await leave.save();
        }
      }
    }
    
    res.render("moreinfoemp", {
      title: 'Employee More Info',
      employee: foundEmployee,
      dh: dhFound,
      moment: moment
    });
  } catch (err) {
    console.error("Error in processEmployeeLeave:", err);
    req.flash("error", "Error processing leave");
    return res.redirect("back");
  }
};

// View pending leaves
export const viewPendingLeaves = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    // Get all employees in the department
    const employees = await Employee.find({ department: dh.department });
    const employeeIds = employees.map(emp => emp._id);

    // Get pending leaves
    const leaves = await Leave.find({
      status: 'pending',
      employeeLeave: { $in: employeeIds }
    })
    .populate({
      path: 'employeeLeave',
      select: 'name email department image'
    })
    .sort({ createdAt: -1 });

    res.render("dh/pending", {
      title: 'Pending Leaves',
      leaves,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in viewPendingLeaves:", error);
    req.flash("error", "Error loading pending leaves");
    res.redirect("/dh/dashboard");
  }
};

// View leave details
export const viewLeaveDetails = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    const leave = await Leave.findById(req.params.leaveId)
      .populate({
        path: 'employeeLeave',
        select: 'name email department image'
      });

    if (!leave) {
      req.flash("error", "Leave application not found");
      return res.redirect("/dh/leave/pending");
    }

    // Verify employee is in the same department
    if (leave.employeeLeave.department !== dh.department) {
      req.flash("error", "You can only view leaves of employees in your department");
      return res.redirect("/dh/leave/pending");
    }

    res.render("dh/leaveInfo", {
      title: 'Leave Details',
      leave,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in viewLeaveDetails:", error);
    req.flash("error", "Error loading leave details");
    res.redirect("/dh/leave/pending");
  }
};

// Approve leave
export const approveLeave = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId },
      {
        $set: {
          status: 'approved',
          finalStatus: 'approved',
          approved: true,
          denied: false,
          approvedBy: dh._id,
          approvedAt: new Date()
        }
      },
      { new: true }
    ).populate({
      path: 'employeeLeave',
      select: 'name email department'
    });

    if (!leave) {
      req.flash("error", "Leave application not found");
      return res.redirect("/dh/leave/pending");
    }

    // Verify employee is in the same department
    if (leave.employeeLeave.department !== dh.department) {
      req.flash("error", "You can only approve leaves of employees in your department");
      return res.redirect("/dh/leave/pending");
    }

    req.flash("success", "Leave application approved successfully");
    res.redirect("/dh/leave/pending");
  } catch (error) {
    console.error("Error in approveLeave:", error);
    req.flash("error", "Error approving leave application");
    res.redirect("/dh/leave/pending");
  }
};

// Reject leave
export const rejectLeave = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    const leave = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId },
      {
        $set: {
          status: 'denied',
          finalStatus: 'denied',
          approved: false,
          denied: true,
          rejectedBy: dh._id,
          rejectedAt: new Date()
        }
      },
      { new: true }
    ).populate({
      path: 'employeeLeave',
      select: 'name email department'
    });

    if (!leave) {
      req.flash("error", "Leave application not found");
      return res.redirect("/dh/leave/pending");
    }

    // Verify employee is in the same department
    if (leave.employeeLeave.department !== dh.department) {
      req.flash("error", "You can only reject leaves of employees in your department");
      return res.redirect("/dh/leave/pending");
    }

    req.flash("success", "Leave application rejected successfully");
    res.redirect("/dh/leave/pending");
  } catch (error) {
    console.error("Error in rejectLeave:", error);
    req.flash("error", "Error rejecting leave application");
    res.redirect("/dh/leave/pending");
  }
};

// View leave history
export const viewLeaveHistory = async (req, res) => {
  try {
    const dh = await DH.findById(req.user._id);
    if (!dh) {
      req.flash("error", "Department Head not found");
      return res.redirect("/auth/login");
    }

    // Get all employees in the department
    const employees = await Employee.find({ department: dh.department });
    const employeeIds = employees.map(emp => emp._id);

    // Get all leaves (not just pending)
    const leaves = await Leave.find({
      employeeLeave: { $in: employeeIds }
    })
    .populate({
      path: 'employeeLeave',
      select: 'name email department image'
    })
    .sort({ createdAt: -1 });

    res.render("dh/leaveHistory", {
      title: 'Leave History',
      leaves,
      moment,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (error) {
    console.error("Error in viewLeaveHistory:", error);
    req.flash("error", "Error loading leave history");
    res.redirect("/dh/dashboard");
  }
};
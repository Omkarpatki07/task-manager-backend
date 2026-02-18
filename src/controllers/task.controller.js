const Task = require("../models/task.model");

/**
 * CREATE TASK
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      status: "todo",
      assignedTo: req.user.id,
      isDeleted: false
    });

    // ✅ Use req.io (since you attached it in server.js)
    if (req.io) {
      req.io.emit("taskUpdated");
    }

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * GET TASKS
 */
exports.getTasks = async (req, res, next) => {
  try {
    let query = { isDeleted: false };

    if (req.user.role === "user") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE TASK
 */
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (req.io) {
      req.io.emit("taskUpdated");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE TASK (Soft)
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Task.findByIdAndUpdate(id, {
      isDeleted: true
    });

    if (req.io) {
      req.io.emit("taskUpdated");
    }

    res.json({ message: "Task deleted (soft)" });
  } catch (err) {
    next(err);
  }
};

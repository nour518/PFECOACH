const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "superadmin"],
  },
  permissions: {
    type: [String],
    default: ["delete_users"], // Permission par défaut
  },
});

// Permet de vérifier si un admin a une certaine permission
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

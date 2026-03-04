import { useState, useEffect, useRef } from "react";
import { Users, Plus, Edit2, Trash2, Save, X, Shield, Eye, EyeOff, Mail, Phone, Upload, Download, UserCog } from "lucide-react";
import { useApi } from "../hooks/useApi";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  password: string;
  userType: "Management" | "Owner" | "Pit Boss" | "Inspector" | "Host" | "Cashier" | "Waiter";
  status: "Active" | "Inactive";
  createdDate: string;
  mustChangePassword?: boolean;
  needsPasswordChange?: boolean;
  email?: string;
  phone?: string;
  signature?: string;
}

const USER_TYPES = [
  {
    type: "Management",
    description: "Access to Everything. Edit and View",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    type: "Owner",
    description: "View Only Access to Everything",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    type: "Pit Boss",
    description: "Access to Edit Float Transactions and Ratings. Full view access",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    type: "Inspector",
    description: "Access to Edit Ratings. No View",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    type: "Host",
    description: "Add Players, Create Rating Cards, and Log Comps. View Only for Player Activity",
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    type: "Cashier",
    description: "Access to Cage Operations, Credit Lines, and Player Cashouts",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
  },
  {
    type: "Waiter",
    description: "Access to Log Comps only",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formUserType, setFormUserType] = useState<User["userType"]>("Host");
  const [formStatus, setFormStatus] = useState<User["status"]>("Active");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSignature, setFormSignature] = useState("");

  useEffect(() => {
    loadUsers();
  }, [api.currentProperty]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openForm = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormUsername(user.username);
      setFormPassword(user.password);
      setFormUserType(user.userType);
      setFormStatus(user.status);
      setFormEmail(user.email || "");
      setFormPhone(user.phone || "");
      setFormSignature(user.signature || "");
    } else {
      setEditingUser(null);
      setFormUsername("");
      setFormPassword("");
      setFormUserType("Host");
      setFormStatus("Active");
      setFormEmail("");
      setFormPhone("");
      setFormSignature("");
    }
    setIsFormOpen(true);
    setShowPassword(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormUsername("");
    setFormPassword("");
    setFormUserType("Host");
    setFormStatus("Active");
    setFormEmail("");
    setFormPhone("");
    setFormSignature("");
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate username (except when editing the same user)
    const isDuplicate = users.some(
      (u) => u.username.toLowerCase() === formUsername.toLowerCase() && u.id !== editingUser?.id
    );

    if (isDuplicate) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = {
          ...editingUser,
          username: formUsername,
          password: formPassword,
          userType: formUserType,
          status: formStatus,
          email: formEmail,
          phone: formPhone,
          signature: formSignature,
        };
        await api.updateUser(editingUser.username, updatedUser);
        await loadUsers();
      } else {
        // Add new user - require password change on first login
        const newUser: User = {
          id: crypto.randomUUID(),
          username: formUsername,
          password: formPassword,
          userType: formUserType,
          status: formStatus,
          createdDate: new Date().toISOString(),
          mustChangePassword: true,
          needsPasswordChange: true,
          email: formEmail,
          phone: formPhone,
          signature: formSignature,
        };
        await api.createUser(newUser);
        await loadUsers();
      }
      closeForm();
    } catch (error: any) {
      console.error("Error saving user:", error);
      alert(error.message || "Failed to save user. Please try again.");
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const userToDelete = users.find((u) => u.id === userId);
        if (userToDelete) {
          await api.deleteUser(userToDelete.username);
          await loadUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const getUserTypeInfo = (userType: User["userType"]) => {
    return USER_TYPES.find((ut) => ut.type === userType) || USER_TYPES[4];
  };

  const exportUsers = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
    toast.success("Users exported successfully!");
  };

  const importUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Import users
        await Promise.all(jsonData.map(async (user) => {
          const newUser: User = {
            id: user.id || crypto.randomUUID(),
            username: user.username,
            password: user.password,
            userType: user.userType,
            status: user.status || "Active",
            createdDate: user.createdDate || new Date().toISOString(),
            mustChangePassword: user.mustChangePassword || false,
            needsPasswordChange: user.needsPasswordChange || false,
            email: user.email,
            phone: user.phone,
            signature: user.signature,
          };
          await api.createUser(newUser);
          await loadUsers();
          toast.success(`User ${user.username} added successfully!`);
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-600 mt-1">
            Manage user accounts and access permissions
          </p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={importUsers}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Import
          </button>
          <button
            onClick={exportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {/* User Type Reference Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          User Type Access Levels
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  User Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Access To
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {USER_TYPES.map((userType) => (
                <tr key={userType.type}>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${userType.bgColor} ${userType.color}`}>
                      {userType.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {userType.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            User Accounts ({users.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  User Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No users found. Click "Add User" to get started.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userTypeInfo = getUserTypeInfo(user.userType);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {user.username}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${userTypeInfo.bgColor} ${userTypeInfo.color}`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.phone || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openForm(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-slate-900">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!!editingUser}
                />
                {editingUser && (
                  <p className="text-xs text-slate-500 mt-1">
                    Username cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  User Type *
                </label>
                <select
                  value={formUserType}
                  onChange={(e) => setFormUserType(e.target.value as User["userType"])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {USER_TYPES.map((ut) => (
                    <option key={ut.type} value={ut.type}>
                      {ut.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as User["status"])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {(formUserType === "Management" || formUserType === "Owner") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Digital Signature
                </label>
                <div className="relative">
                  <UserCog className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formSignature}
                    onChange={(e) => setFormSignature(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., John Smith or J. Smith"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  This signature will appear on all printed documents. If not provided, username will be used.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

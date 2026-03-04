import { useState, useEffect, useRef } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Download,
  Camera,
  QrCode,
  Calendar,
  Cake,
  UserCheck,
  FileSpreadsheet,
  Star,
  TrendingUp,
  UserCircle,
  Shield,
} from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import QRCode from "qrcode";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  startingDate: string;
  birthday?: string;
  qrCode?: string; // QR code data URL
  qrCodeEnabled: boolean; // Whether QR login is enabled
  position?: string;
  department?: string;
  salary?: number; // Employee salary
  status: "Active" | "Inactive";
  assignedToUserGroup: boolean;
  linkedUsername?: string; // If assigned to user group, which username
  staffDiscountEnabled: boolean; // Whether employee can use 50% staff discount
  performanceReviews: PerformanceReview[];
  createdDate: string;
}

interface PerformanceReview {
  id: string;
  date: string;
  reviewer: string;
  rating: number; // 1-5 stars
  notes: string;
  nextReviewDate: string;
}

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formProfilePicture, setFormProfilePicture] = useState("");
  const [formStartingDate, setFormStartingDate] = useState("");
  const [formBirthday, setFormBirthday] = useState("");
  const [formQRCodeEnabled, setFormQRCodeEnabled] = useState(false);
  const [formPosition, setFormPosition] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formAssignedToUserGroup, setFormAssignedToUserGroup] = useState(false);
  const [formLinkedUsername, setFormLinkedUsername] = useState("");
  const [formStaffDiscountEnabled, setFormStaffDiscountEnabled] = useState(false);
  const [formSalary, setFormSalary] = useState<number | undefined>(undefined);

  // Users list for linking
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadEmployees();
    loadUsers();
  }, [api.currentProperty]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const loadedUsers = await api.getUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const openForm = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormFirstName(employee.firstName);
      setFormLastName(employee.lastName);
      setFormEmail(employee.email || "");
      setFormPhone(employee.phone || "");
      setFormProfilePicture(employee.profilePicture || "");
      setFormStartingDate(employee.startingDate);
      setFormBirthday(employee.birthday || "");
      setFormQRCodeEnabled(employee.qrCodeEnabled);
      setFormPosition(employee.position || "");
      setFormDepartment(employee.department || "");
      setFormStatus(employee.status);
      setFormAssignedToUserGroup(employee.assignedToUserGroup);
      setFormLinkedUsername(employee.linkedUsername || "");
      setFormStaffDiscountEnabled(employee.staffDiscountEnabled);
      setFormSalary(employee.salary);
    } else {
      setEditingEmployee(null);
      setFormFirstName("");
      setFormLastName("");
      setFormEmail("");
      setFormPhone("");
      setFormProfilePicture("");
      setFormStartingDate(new Date().toISOString().split("T")[0]);
      setFormBirthday("");
      setFormQRCodeEnabled(false);
      setFormPosition("");
      setFormDepartment("");
      setFormStatus("Active");
      setFormAssignedToUserGroup(false);
      setFormLinkedUsername("");
      setFormStaffDiscountEnabled(false);
      setFormSalary(undefined);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPhone("");
    setFormProfilePicture("");
    setFormStartingDate("");
    setFormBirthday("");
    setFormQRCodeEnabled(false);
    setFormPosition("");
    setFormDepartment("");
    setFormStatus("Active");
    setFormAssignedToUserGroup(false);
    setFormLinkedUsername("");
    setFormStaffDiscountEnabled(false);
    setFormSalary(undefined);
  };

  const generateQRCode = async (employeeId: string): Promise<string> => {
    try {
      const qrData = JSON.stringify({
        type: "employee",
        id: employeeId,
        property: api.currentProperty,
      });
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  const calculateNextReviewDate = (startDate: string): string => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split("T")[0];
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFirstName || !formLastName || !formStartingDate) {
      toast.error("First name, last name, and starting date are required");
      return;
    }

    try {
      if (editingEmployee) {
        // Update existing employee
        const updatedEmployee: Employee = {
          ...editingEmployee,
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          phone: formPhone,
          profilePicture: formProfilePicture,
          startingDate: formStartingDate,
          birthday: formBirthday,
          qrCodeEnabled: formQRCodeEnabled,
          position: formPosition,
          department: formDepartment,
          salary: formSalary,
          status: formStatus,
          assignedToUserGroup: formAssignedToUserGroup,
          linkedUsername: formLinkedUsername,
          staffDiscountEnabled: formStaffDiscountEnabled,
        };

        // Regenerate QR code if needed
        if (formQRCodeEnabled && !editingEmployee.qrCode) {
          updatedEmployee.qrCode = await generateQRCode(editingEmployee.id);
        } else if (!formQRCodeEnabled) {
          updatedEmployee.qrCode = "";
        } else {
          updatedEmployee.qrCode = editingEmployee.qrCode;
        }

        await api.updateEmployee(editingEmployee.id, updatedEmployee);
        toast.success("Employee updated successfully!");
      } else {
        // Create new employee
        const employeeId = crypto.randomUUID();
        const qrCode = formQRCodeEnabled ? await generateQRCode(employeeId) : "";

        const newEmployee: Employee = {
          id: employeeId,
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          phone: formPhone,
          profilePicture: formProfilePicture,
          startingDate: formStartingDate,
          birthday: formBirthday,
          qrCode,
          qrCodeEnabled: formQRCodeEnabled,
          position: formPosition,
          department: formDepartment,
          salary: formSalary,
          status: formStatus,
          assignedToUserGroup: formAssignedToUserGroup,
          linkedUsername: formLinkedUsername,
          staffDiscountEnabled: formStaffDiscountEnabled,
          performanceReviews: [
            {
              id: crypto.randomUUID(),
              date: formStartingDate,
              reviewer: api.currentUser?.username || "System",
              rating: 0,
              notes: "Initial hire",
              nextReviewDate: calculateNextReviewDate(formStartingDate),
            },
          ],
          createdDate: new Date().toISOString(),
        };

        await api.createEmployee(newEmployee);
        toast.success("Employee added successfully!");
      }

      await loadEmployees();
      closeForm();
    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast.error(error.message || "Failed to save employee");
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.deleteEmployee(employeeId);
        toast.success("Employee deleted successfully!");
        await loadEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee");
      }
    }
  };

  const exportToExcel = () => {
    const exportData = employees.map((emp) => ({
      "First Name": emp.firstName,
      "Last Name": emp.lastName,
      Email: emp.email || "",
      Phone: emp.phone || "",
      Position: emp.position || "",
      Department: emp.department || "",
      "Starting Date": emp.startingDate,
      Birthday: emp.birthday || "",
      Status: emp.status,
      "QR Enabled": emp.qrCodeEnabled ? "Yes" : "No",
      "Assigned to User Group": emp.assignedToUserGroup ? "Yes" : "No",
      "Linked Username": emp.linkedUsername || "",
      "Staff Discount Enabled": emp.staffDiscountEnabled ? "Yes" : "No",
      Salary: emp.salary || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, `employees_${api.currentProperty}_${Date.now()}.xlsx`);
    toast.success("Employees exported to Excel!");
  };

  const importFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let successCount = 0;
        let errorCount = 0;

        for (const row of jsonData as any[]) {
          try {
            const employeeId = crypto.randomUUID();
            const qrCodeEnabled = row["QR Enabled"]?.toLowerCase() === "yes";
            const qrCode = qrCodeEnabled ? await generateQRCode(employeeId) : "";

            const employee: Employee = {
              id: employeeId,
              firstName: row["First Name"] || "",
              lastName: row["Last Name"] || "",
              email: row["Email"] || "",
              phone: row["Phone"] || "",
              profilePicture: "",
              startingDate: row["Starting Date"] || new Date().toISOString().split("T")[0],
              birthday: row["Birthday"] || "",
              qrCode,
              qrCodeEnabled,
              position: row["Position"] || "",
              department: row["Department"] || "",
              salary: row["Salary"] ? parseFloat(row["Salary"]) : undefined,
              status: (row["Status"] as "Active" | "Inactive") || "Active",
              assignedToUserGroup: row["Assigned to User Group"]?.toLowerCase() === "yes",
              linkedUsername: row["Linked Username"] || "",
              staffDiscountEnabled: row["Staff Discount Enabled"]?.toLowerCase() === "yes",
              performanceReviews: [
                {
                  id: crypto.randomUUID(),
                  date: row["Starting Date"] || new Date().toISOString().split("T")[0],
                  reviewer: api.currentUser?.username || "System",
                  rating: 0,
                  notes: "Imported from Excel",
                  nextReviewDate: calculateNextReviewDate(
                    row["Starting Date"] || new Date().toISOString().split("T")[0]
                  ),
                },
              ],
              createdDate: new Date().toISOString(),
            };

            await api.createEmployee(employee);
            successCount++;
          } catch (error) {
            console.error("Error importing employee:", error);
            errorCount++;
          }
        }

        await loadEmployees();
        toast.success(`Imported ${successCount} employees successfully!${errorCount > 0 ? ` (${errorCount} errors)` : ""}`);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const getUpcomingReviews = () => {
    const today = new Date();
    const upcomingReviews: Array<{ employee: Employee; review: PerformanceReview }> = [];

    employees.forEach((emp) => {
      emp.performanceReviews.forEach((review) => {
        const reviewDate = new Date(review.nextReviewDate);
        const daysUntilReview = Math.ceil(
          (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilReview >= 0 && daysUntilReview <= 30) {
          upcomingReviews.push({ employee: emp, review });
        }
      });
    });

    return upcomingReviews.sort((a, b) => {
      const dateA = new Date(a.review.nextReviewDate).getTime();
      const dateB = new Date(b.review.nextReviewDate).getTime();
      return dateA - dateB;
    });
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return employees
      .filter((emp) => emp.birthday)
      .map((emp) => {
        const birthday = new Date(emp.birthday!);
        const thisBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());

        if (thisBirthday < today) {
          thisBirthday.setFullYear(currentYear + 1);
        }

        const daysUntilBirthday = Math.ceil(
          (thisBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return { employee: emp, daysUntilBirthday, date: thisBirthday };
      })
      .filter((item) => item.daysUntilBirthday <= 30)
      .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
  };

  const upcomingReviews = getUpcomingReviews();
  const upcomingBirthdays = getUpcomingBirthdays();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Employee Management</h2>
          <p className="text-slate-600 mt-1">
            Manage employees, performance reviews, and QR login access
          </p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={importFromExcel}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Import Excel
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Excel
          </button>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Employees</p>
              <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {employees.filter((e) => e.status === "Active").length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Upcoming Reviews</p>
              <p className="text-2xl font-bold text-amber-600">{upcomingReviews.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Upcoming Birthdays</p>
              <p className="text-2xl font-bold text-pink-600">{upcomingBirthdays.length}</p>
            </div>
            <Cake className="w-8 h-8 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Upcoming Reviews & Birthdays */}
      {(upcomingReviews.length > 0 || upcomingBirthdays.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingReviews.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Upcoming Performance Reviews
              </h3>
              <div className="space-y-2">
                {upcomingReviews.slice(0, 3).map(({ employee, review }) => (
                  <div key={review.id} className="flex items-center justify-between">
                    <span className="text-sm text-amber-900">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      {new Date(review.nextReviewDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingBirthdays.length > 0 && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
                <Cake className="w-5 h-5" />
                Upcoming Birthdays
              </h3>
              <div className="space-y-2">
                {upcomingBirthdays.slice(0, 3).map(({ employee, daysUntilBirthday, date }) => (
                  <div key={employee.id} className="flex items-center justify-between">
                    <span className="text-sm text-pink-900">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-xs text-pink-700 bg-pink-100 px-2 py-1 rounded">
                      {daysUntilBirthday === 0
                        ? "Today!"
                        : `${daysUntilBirthday} day${daysUntilBirthday > 1 ? "s" : ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Photo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Starting Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  QR Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  User Group
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No employees found. Click "Add Employee" to get started.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {employee.profilePicture ? (
                        <img
                          src={employee.profilePicture}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      {employee.email && (
                        <div className="text-xs text-slate-500">{employee.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {employee.position || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {employee.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(employee.startingDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {employee.qrCodeEnabled ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          Enabled
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {employee.assignedToUserGroup ? (
                        <div>
                          <span className="text-xs font-semibold text-green-800">
                            {employee.linkedUsername}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openForm(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEmployee(employee.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-slate-900">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {formProfilePicture ? (
                    <img
                      src={formProfilePicture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <input
                    ref={profilePictureInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => profilePictureInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Upload Photo
                  </button>
                  {formProfilePicture && (
                    <button
                      type="button"
                      onClick={() => setFormProfilePicture("")}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Position & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Manager, Dealer, Host"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Gaming Floor, Cage, Management"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Starting Date *
                  </label>
                  <input
                    type="date"
                    value={formStartingDate}
                    onChange={(e) => setFormStartingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={formBirthday}
                    onChange={(e) => setFormBirthday(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* QR Code Login */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="qrEnabled"
                    checked={formQRCodeEnabled}
                    onChange={(e) => setFormQRCodeEnabled(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="qrEnabled" className="flex items-center gap-2 cursor-pointer">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">
                      Enable QR Code Login for this employee
                    </span>
                  </label>
                </div>
                <p className="text-xs text-slate-600 mt-2 ml-8">
                  Employee can scan their QR card to quickly log in to the app
                </p>
              </div>

              {/* User Group Assignment */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="assignToUserGroup"
                    checked={formAssignedToUserGroup}
                    onChange={(e) => setFormAssignedToUserGroup(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="assignToUserGroup"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">
                      Assign to User Group
                    </span>
                  </label>
                </div>
                {formAssignedToUserGroup && (
                  <div className="ml-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Link to Username
                    </label>
                    <select
                      value={formLinkedUsername}
                      onChange={(e) => setFormLinkedUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.username}>
                          {user.username} ({user.userType})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      This employee will have the permissions of the selected user account
                    </p>
                  </div>
                )}
              </div>

              {/* Staff Discount */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="staffDiscountEnabled"
                    checked={formStaffDiscountEnabled}
                    onChange={(e) => setFormStaffDiscountEnabled(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="staffDiscountEnabled"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Star className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">
                      Enable 50% Staff Discount
                    </span>
                  </label>
                </div>
                <p className="text-xs text-slate-600 mt-2 ml-8">
                  Employee can use a 50% discount on all purchases
                </p>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
                <input
                  type="number"
                  value={formSalary !== undefined ? formSalary.toString() : ""}
                  onChange={(e) => setFormSalary(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingEmployee ? "Update Employee" : "Add Employee"}
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
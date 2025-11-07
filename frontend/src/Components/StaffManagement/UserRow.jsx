// src/Components/StaffManagement/UserRow.jsx
import { verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import { deleteHospStaff, GetAllHospStaff } from "../../api/HospStaff";
import { DeleteItems } from "../../Utils/Alerts/SuccessAlert";
import toast from "react-hot-toast";
import { useState } from "react";

const badgeColor = {
  admin: "bg-red-100 text-red-700",
  doctor: "bg-green-200 text-gray-700",
  staff: "bg-violet-200 text-gray-700",
  patient: "bg-orange-100 text-gray-700",
};

const statusColor = {
  active: "bg-black text-white",
  inactive: "bg-gray-200 text-gray-600",
};

const UserRow = ({
  id,
  name = "N/A",
  email = "-",
  role = "Staff",
  status = "deactivated",
  created_at,
  lastLoginAt,
  onDelete,
  onEdit,
}) => {
  const [loading, setLoading] = useState(false);

  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDelete = async (userId) => {
    console.log(userId)
    const confirmed = await verifyDelete("user");
    if (!confirmed) return;

    try {
      const staffList = await GetAllHospStaff();
      const staffArray = staffList?.data?.staffs;
      console.log(staffArray)

      const staffToDelete = staffArray.find(
        (staff) => staff.user_id?._id === userId
      );

      if (!staffToDelete) {
        toast.error("User exists but is not assigned as Hospital Staff.");
        return;
      }

      const res = await deleteHospStaff(staffToDelete._id);
      if (res?.success) {
        DeleteItems("user");
        onDelete?.(userId);
      } else {
        toast.error("Failed to delete staff");
      }
    } catch (err) {
      toast.error("Error deleting user");
      console.error(err);
    }
  };

  const handleEdit = async (user) => {
    // Block edit for deactivated users
  if (user.status?.toLowerCase() === "deactivated" || user.isActive === "false") {
    toast.error("This user is deactivated and cannot be edited.");
    return;
  }

    setLoading(true);
    try {
      const staffList = await GetAllHospStaff();
      const staffArray = staffList?.data?.staffs;
      console.log(staffArray)
      const staffRecord = staffArray.find(
        (s) => s.user_id?._id === user._id
      );

      if (!staffRecord) {
        toast.error("Hospital staff not found for this user");
        return;
      }

      //  Send full staff record (has correct _id) to modal
      onEdit(staffRecord);
    } catch (err) {
      toast.error("Error fetching staff details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b last:border-none hover:bg-gray-50 text-xs sm:text-sm">
      {/* User Info */}
      <td className="py-3 flex items-center space-x-2 sm:space-x-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase">
          {name?.charAt(0) || "?"}
        </div>
        <div className="truncate max-w-[100px] sm:max-w-none">
          <p className="font-medium text-gray-800 truncate">{name}</p>
          <p className="text-gray-500 text-[10px] sm:text-xs truncate">{email}</p>
        </div>
      </td>

      {/* Role */}
      <td>
        <span
          className={`px-2 py-1 text-[10px] sm:text-xs rounded-md ${badgeColor[role?.toLowerCase()]}`}
        >
          {role}
        </span>
      </td>

      {/* Status */}
      <td>
        <span
          className={`px-2 py-1 text-[10px] sm:text-xs rounded-md ${statusColor[status?.toLowerCase()]}`}
        >
          {status}
        </span>
      </td>

      {/* Dates */}
      <td className="text-gray-600 whitespace-nowrap">{formatDateTime(created_at)}</td>
      <td className="text-gray-600 whitespace-nowrap">{formatDateTime(lastLoginAt)}</td>

      {/* Actions */}
      <td className="flex flex-row gap-4">
        {role?.toLowerCase() !== "admin" && (
          <>
        <button
          title="Update User"
          onClick={() => handleEdit({ _id: id, name, email, role, status })}
          disabled={loading}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button
          title="Delete user"
          onClick={() => handleDelete(id)}
          disabled={loading}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
        </>
        )}
      </td>
    </tr>
  );
};

export default UserRow;

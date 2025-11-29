import toast from "react-hot-toast"
import Swal from 'sweetalert2'

export const showInvalidCredentials = () => {
  return toast.error("Invalid credentials")
}


export const verifyDelete = async (itemType = "item") => {
  const result = await Swal.fire({
    title: `Are you sure you want to delete this ${itemType}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  // Return true if confirmed
  return result.isConfirmed;
};


export const verifyComplete = async (itemType = "item") => {
  const result = await Swal.fire({
    title: `Please verify ${itemType} Marking as completed cannot be undone.`,
    icon: "success", // Green check icon
    showCancelButton: true,
    confirmButtonText: "Yes, update!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  // Return true if confirmed
  return result.isConfirmed;
};
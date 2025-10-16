import toast from "react-hot-toast"
export const DeleteItems = (itemType) => {
  return toast.success(` ${itemType} deleted successfully`);
};
import { useEffect, useState } from "react";
import { DeleteBloodBank, GetAllBloodType, UpdateBloodBank } from "../../api/BloodBankApi";
import toast from "react-hot-toast";
import Sidebar from "../../Components/Layouts/Sidebar";
import Navbar from "../../Components/Layouts/Navbar";
import PageWrapper from "../../Components/pageWrappers";

const BloodStockAdj = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stocks on load
  const fetchData = async () => {
    setLoading(true);
    const res = await GetAllBloodType();

    if (res?.success) {
      setStocks(res.data.bloodBank);
    } else {
      toast.error("Failed to load stock");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update a specific row
  const handleStockUpdate = async (id, newUnits) => {
    if (newUnits === "" || newUnits < 0) {
      toast.error("Units must be 0 or above");
      return;
    }

    const res = await UpdateBloodBank(id, { available_unit: Number(newUnits) });

    if (res?.success) {
      toast.success("Stock updated");
      fetchData();
    } else {
      toast.error(res?.message || "Update failed");
    }
  };

  // Reset to zero
  const handleReset = async (id) => {
    const res = await DeleteBloodBank(id);

    if (res?.success) {
      toast.success("Stock reset to zero");
      fetchData();
    } else {
      toast.error(res?.message || "Reset failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <PageWrapper>
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Navbar />

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-100">
            Blood Stock Adjustment
          </h2>

          <div className="bg-white dark:bg-gray-800 
                          rounded-xl shadow-sm 
                          border dark:border-gray-700 p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 
                               text-gray-700 dark:text-gray-200">
                  <th className="border dark:border-gray-600 p-3 text-left font-medium">Blood Type</th>
                  <th className="border dark:border-gray-600 p-3 text-left font-medium">Available Units</th>
                  <th className="border dark:border-gray-600 p-3 text-center font-medium">Update</th>
                  <th className="border dark:border-gray-600 p-3 text-center font-medium">Reset To Zero</th>
                </tr>
              </thead>

              <tbody>
                {stocks.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <td className="border dark:border-gray-700 p-3 text-gray-800 dark:text-gray-100">{item.blood_type}</td>

                    <td className="border dark:border-gray-700 p-3">
                      <input
                        type="number"
                        defaultValue={item.available_unit}
                        min="0"
                        className="border dark:border-gray-600
                                   bg-white dark:bg-gray-700
                                   text-gray-800 dark:text-gray-100
                                   rounded-lg px-2 py-1 w-24
                                   focus:ring focus:ring-blue-300 dark:focus:ring-blue-600
                                   outline-none"
                        onChange={(e) => {
                          item.newUnits = e.target.value;
                        }}
                      />
                    </td>

                    <td className="border dark:border-gray-700 p-3 text-center">
                      <button
                        onClick={() =>
                          handleStockUpdate(
                            item._id,
                            item.newUnits ?? item.available_unit
                          )
                        }
                        className="bg-blue-600 dark:bg-blue-700
                                   hover:bg-blue-700 dark:hover:bg-blue-800
                                   text-white px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        Update
                      </button>
                    </td>

                    <td className="border dark:border-gray-700 p-3 text-center">
                      <button
                        onClick={() => handleReset(item._id)}
                        className="bg-red-600 dark:bg-red-700
                                   hover:bg-red-700 dark:hover:bg-red-800
                                   text-white px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    </PageWrapper>
  );
};

export default BloodStockAdj;

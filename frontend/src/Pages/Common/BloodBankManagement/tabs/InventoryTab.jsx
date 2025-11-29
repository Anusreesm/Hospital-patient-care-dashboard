import { useState } from "react";
import PageWrapper from "../../../../Components/pageWrappers";

const InventoryTab = ({ data = [] }) => {
  const [filterType, setFilterType] = useState("all");

  // FILTER LOGIC
  const filteredData = data.filter(item => {
    if (filterType === "critical") return item.available_unit <= 10;
    if (filterType === "expiring") return item.available_unit > 10 && item.available_unit < 30;
    if (filterType === "healthy") return item.available_unit >= 30;
    return true; 
  });

  // STATUS BASED COLOR
  const getStatusColor = (units) => {
    // Critical
    if (units <= 10) return "border-red-500 bg-red-100";    
    // Expiring       
    if (units > 10 && units < 30) return "border-orange-500 bg-orange-50"; 
    // Healthy
    return "border-green-500 bg-green-100";                         
  };

  const getBadge = (units) => {
    if (units <= 10) 
      return <span className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">CRITICAL TYPES</span>;
    if (units > 10 && units < 30) 
      return <span className="px-2 py-1 text-xs font-semibold bg-orange-500 text-black rounded-full">EXPIRING SOON</span>;
    return <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">HEALTHY TYPES</span>;
  };

  return (
    <PageWrapper>
    <div className="space-y-4">

      {/* FILTER DROPDOWN */}
      <select
        className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="critical">Critical (≤10 units)</option>
        <option value="expiring">Expiring (10–30 units)</option>
        <option value="healthy">Healthy (≥30 units)</option>
      </select>

      {/* LIST OF CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((b) => {
            // for progress bar
          const percent = Math.min((b.available_unit / 50) * 100, 100); 

          return (
            <div
              key={b._id}
              className={`p-4 rounded-xl border shadow ${getStatusColor(b.available_unit)}`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold dark:text-black">{b.blood_type}</h2>
                {getBadge(b.available_unit)}
              </div>

              {/* Units */}
              <p className="text-sm text-gray-700 mb-2">
                Units Available: <span className="font-bold">{b.available_unit}</span>
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-300 h-3 rounded-full">
                <div
                  className={`h-3 rounded-full 
                    ${b.available_unit <= 10 ? "bg-red-600" 
                    : b.available_unit < 30 ? "bg-yellow-500" 
                    : "bg-green-600"}`
                  }
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
    </PageWrapper>
  );
};

export default InventoryTab;

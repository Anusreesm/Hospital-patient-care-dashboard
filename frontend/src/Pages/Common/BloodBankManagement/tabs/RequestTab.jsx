import { useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import RequestTable from "../../../../Components/BloodBankManagement/Requests/RequestTable";
import { NavLink } from "react-router-dom";
import PageWrapper from "../../../../Components/pageWrappers";

const RequestTab = ({ requests = [] }) => {
  const { userRole } = useAuth()
  const [priority, setPriority] = useState("all");

  const filtered = requests.filter((r) => {
    if (priority === "all") return true;
    return r.priority?.toLowerCase() === priority;
  });

  return (
    <PageWrapper>
      <div className="space-y-4">

        <div className="flex flex-row gap-5">
          {/* PRIORITY DROPDOWN */}
          <select
            className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="emergency">Emergency</option>
          </select>
          <NavLink
            to={`/${userRole}/bloodBankManagement/createRequest`}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Create New Request
          </NavLink>
        </div>

        {/* REQUEST LIST */}
        <div className="space-y-2">
          <RequestTable
            request={filtered}
          />
        </div>

      </div>
    </PageWrapper>
  );
};

export default RequestTab;

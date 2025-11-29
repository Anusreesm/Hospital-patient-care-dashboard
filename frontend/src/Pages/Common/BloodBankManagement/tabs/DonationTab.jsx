import { useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import { NavLink } from "react-router-dom";
import DonorTable from "../../../../Components/BloodBankManagement/Donors/DonorTable";
import PageWrapper from "../../../../Components/pageWrappers";

const DonationTab = ({ donations = [] }) => {
  const {userRole}=useAuth()
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = donations.filter(d => {
    if (statusFilter === "scheduled") return d.status?.toLowerCase() === "scheduled";
    if (statusFilter === "completed") return d.status?.toLowerCase() === "completed";
    return true; // ALL
  });

  return (
    <PageWrapper>
    <div className="space-y-4">


      <div className="flex flex-row gap-5">
      {/* <div className="flex flex-row gap-5 sticky top-0 bg-white z-10 p-2"> */}
        {/* FILTER DROPDOWN */}
        <select
          className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Donations</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>
        <NavLink
          to={`/${userRole}/bloodBankManagement/createDonation`}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
         Schedule New Donation
        </NavLink>


      </div>


      {/* TABLE */}
      <DonorTable
        donor={filtered}
        // onEdit={(d) => console.log("Edit:", d)}
        // onDelete={(id) => console.log("Delete:", id)}
      />


    </div>
    </PageWrapper>
  );
};

export default DonationTab;

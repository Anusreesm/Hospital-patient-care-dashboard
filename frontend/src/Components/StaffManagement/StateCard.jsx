const StatCard = ({ label, value, color }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl py-3 sm:py-4 px-4 text-center">
      <h2 className={`text-lg sm:text-2xl font-semibold ${color}`}>{value}</h2>
      <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
    </div>
  );
};

export default StatCard;

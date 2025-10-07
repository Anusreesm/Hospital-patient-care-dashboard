const Select = ({  value, className = '', children,...props }) => {
  return (
    <select    
      value={value}
      {...props}
    className={`border border-none rounded-md p-1 w-full  ${className}`} // combine default + custom
    >
        {children}
    </select>
  );
};

export default Select;
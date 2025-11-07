const Input = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  ...props 
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
};

export default Input;

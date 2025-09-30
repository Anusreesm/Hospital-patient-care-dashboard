const Input = ({ type='text', value, className = '', ...props }) => {
  return (
    <input
      type={type}
      value={value}
      {...props}
    className={`border border-none rounded-md p-1 w-full  ${className}`} // combine default + custom
    />
  );
};

export default Input;
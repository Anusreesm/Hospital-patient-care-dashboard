const Button = ({ children, className = '', ...props }) => {
  return (
  <button 
  {...props}
   className={`w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${className}`}
  >
    {children}
  </button>
  )
}
export default Button;
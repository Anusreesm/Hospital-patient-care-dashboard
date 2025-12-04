const API_URL = "https://hospital-patient-care-dashboard-ve5d.onrender.com/api/users";


export const LoginUser= async({email,password})=>{
 
 const res=await fetch(`${API_URL}/login`,{
    method:'POST',
    headers:{'Content-Type':'application/json',
        
    },
    body:JSON.stringify({email,password})
 })
 const result= await res.json()
 return result
}

export const ChangeStatus = async ({ id, status }) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
 if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/status/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` //token
      },
      body: JSON.stringify({ status })
    });

    const result = await res.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: "Network error",
      error: error.message
    };
  }
};


export const GetAllUsers= async()=>{
   const token = localStorage.getItem("token"); //  JWT token
 if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
     
   })
   const result = await res.json()
   return result
}

export const deleteUser = async (id) => {
   const token = localStorage.getItem("token"); //  JWT token
 if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
       },
     
   })
   const result = await res.json()
   return result
}
export const EmailCheck = async (email) => {
  const res = await fetch(`${API_URL}/check-email/${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  result.status = res.status; 
  return result;
};

export const getUserById = async (id) => {
     const token = localStorage.getItem("token"); //  JWT token
 if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      
   })
   const result = await res.json()
   return result
}


export const changeUserPw = async (id, data) => {
   try {
    const token = localStorage.getItem("token"); //  JWT token
 if (!token) return { success: false, message: "User not logged in" };
      const res = await fetch(`${API_URL}/password/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(data),
      });

      const result = await res.json();
      return result;
   } catch (error) {
      return {
         success: false,
         message: "Network error",
         error: error.message
      };
   }
};


export const forgotPw = async (data) => {
  try {
    const res = await fetch(`${API_URL}/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;

  } catch (error) {
    return {
      success: false,
      message: "Network error",
      error: error.message,
    };
  }
};


export const resetPw = async (token, data) => {
  try {
    const res = await fetch(`${API_URL}/resetPassword/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),   // { password: "newPassword" }
    });

    const result = await res.json();
    return result;

  } catch (error) {
    return {
      success: false,
      message: "Network error",
      error: error.message,
    };
  }
};

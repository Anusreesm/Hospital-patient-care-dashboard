export const LoginUser= async({email,password})=>{
 const res=await fetch('http://localhost:3000/api/users/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
 })
 const result= await res.json()
 return result
}

export const ChangeStatus= async({id})=>{
   const res = await fetch(`http://localhost:3000/api/users/status/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status }),
   })
   const result = await res.json()
   return result
}

export const GetAllUsers= async()=>{
   const res = await fetch(`http://localhost:3000/api/users/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}

export const deleteUser = async (id) => {
   const res = await fetch(`http://localhost:3000/api/users/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}
export const EmailCheck = async (email) => {
  const res = await fetch(`http://localhost:3000/api/users/check-email/${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  result.status = res.status; 
  return result;
};

export const getUserById = async (id) => {
   const res = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}


export const changeUserPw = async (id, data) => {
   try {
      const res = await fetch(`http://localhost:3000/api/users/password/${id}`, {
         method: "PATCH",
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
         error: error.message
      };
   }
};


export const forgotPw = async (data) => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/forgotPassword`, {
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
    const res = await fetch(`http://localhost:3000/api/users/resetPassword/${token}`, {
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

const createPatientToken=async(lastAppointment )=>{
// start from 1
  let nextNumber = 1;

  if (lastAppointment && lastAppointment.token_no) {
    const lastToken = lastAppointment.token_no.split("-")[1];
    nextNumber = parseInt(lastToken) + 1;
  }

  // pad with zeros: e.g. 0001, 0002, ...
  const paddedNumber = String(nextNumber).padStart(4, "0");

  const token_no = `MT-${paddedNumber}`;

  return token_no; // return the generated token
};
export default createPatientToken
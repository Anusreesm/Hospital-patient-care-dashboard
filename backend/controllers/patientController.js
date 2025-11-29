
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import addressModel from "../models/Addresses.js"
import appointmentModel from "../models/Appointment.js"
import patientModel from "../models/Patient.js"
import regModel from "../models/Registration.js"
import userModel from "../models/User.js"
import { getPatientsByIdQuery, getPatientsQuery } from "../services/patientService.js"
import createUserWithTempPw from "../utils/createUserWithTempPw.js"
import SendMail from "../utils/emails/sendMail.js"
import EmailTempForTempPw from "../utils/emails/templates/emailTemplatesForTempPw.js"


// @desc    register new patient
// @route   POST/api/patient/register
// @access admin/staff 
export const registerPatient = async (req, res) => {
    const session = await patientModel.startSession(); // start transaction session
    session.startTransaction(); // begin transaction
    try {
        let { user_id,
            name,
            addresses,        // expect full address object here
            phone,
            age,
            email,
            gender,
            bloodType,
            emergency_name,
            emergency_contact,
            registration      //  expect registration details here
        } = req.body
        //  phone number includes +91 
        if (phone && !phone.startsWith("+91")) {
            phone = `+91${phone.replace(/^\+?91/, "").trim()}`;
        }

        //  CHECK IF USER EXISTS BY EMAIL
        const existingUser = await userModel.findOne({ email }).session(session);
        //  USER ALREADY EXISTS → DO NOT CREATE NEW USER/PATIENT
        if (existingUser) {


            const existingPatient = await patientModel
                .findOne({ user_id: existingUser._id })
                .session(session);

            if (!existingPatient) {
                await session.abortTransaction();
                session.endSession();

                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    "User exists, but no patient profile found"
                );
            }
            // BLOCK re-registration if patient has active registration
            const activeReg = await regModel.findOne({
                patient_id: existingPatient._id,
                status: "active",
                discharge_date: null
            }).session(session);

            if (activeReg) {
                await session.abortTransaction();
                session.endSession();
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    "Patient already has an active registration. Cannot create a new one until discharged."
                );
            }

            // 2B → Create ONLY a registration record
            const registrationDoc = await regModel.create([{
                user_id: existingUser._id,
                patient_id: existingPatient._id,
                registration_date: registration?.registration_date || Date.now(),
                discharge_date: registration?.discharge_date || null,
                medical_condition: registration?.medical_condition || null,
                allergies: registration?.allergies || null,
                status: registration?.status || "active"
            }], { session });

            await session.commitTransaction();
            session.endSession();

            return successResponse(
                res,
                STATUS.OK,
                registrationDoc[0],
                "Existing patient registration created successfully"
            );
        }


        // ---------------------------------------------------------
        // NEW USER + NEW PATIENT
        // ---------------------------------------------------------
        //1  Create user with temp password
        const { newUser, tempPassword } = await createUserWithTempPw(email, 'patient', name);

        // 2️ Create address (if provided)
        let addressDoc = null;
        if (addresses) {
            addressDoc = await addressModel.create({
                street: addresses.street,
                city: addresses.city,
                state: addresses.state,
                country: addresses.country,
                pincode: addresses.pincode
            });
        }
        // 3 to create patient details
        const patient = await patientModel.create({
            user_id: newUser._id,
            //    after implementing middle ware (req.user.id)
            created_by: req.body.user_id,
            name,
            addresses_id: addressDoc ? addressDoc._id : null,  // link address if created
            phone: phone.trim(),
            age,
            gender,
            bloodType,
            emergency_name: emergency_name?.trim() || null,
            emergency_contact: emergency_contact?.trim() || null
        });
        console.log("FULL PATIENT:", patient.patient_id)

        // populate references separately
        await patient.populate([
            { path: "user_id" },
            { path: "addresses_id" },
            // { path: "bloodType,", select: "blood_type" }
        ]);
        // 4️ Create registration details (if provided)
        let registrationDoc = null;
        if (registration) {
            registrationDoc = await regModel.create({
                user_id: newUser._id,
                patient_id: patient._id,
                registration_date: registration.registration_date || Date.now(),
                discharge_date: registration.discharge_date || null,
                medical_condition: registration.medical_condition || null,
                allergies: registration.allergies || null,
                status: registration.status || "active"
            });
        }
        await session.commitTransaction(); // save all documents
        session.endSession(); // end the session

        //5 Send temp password email
        const emailContent = EmailTempForTempPw({ toEmail: email, tempPassword, role: 'patient', name });
        await SendMail(email, emailContent);

        // 6 return response
        return successResponse(
            res,
            STATUS.CREATED,
            {
                _id: patient._id,
                user: patient.user_id,
                name: patient.name,
                addresses: patient.addresses_id,
                phone: patient.phone,
                age: patient.age,
                email: patient.user_id.email,
                gender: patient.gender,
                bloodBank: patient.bloodType,
                emergency_name: patient.emergency_name,
                emergency_contact: patient.emergency_contact,
                tempPassword
            },
            MESSAGES.PATIENT.PATIENT_CREATED
        )
    }
    catch (error) {
        await session.abortTransaction(); // rollback everything
        session.endSession();
        console.log(error, "error")
          console.error("REGISTER PATIENT ERROR:", error);

        // Duplicate email → for safety
        if (error.code === 11000) {
            return errorResponse(
                res,
                STATUS.BAD_REQUEST,
                "Duplicate email — patient already exists"
            );
        }

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}


// @route   GET/api/patient/
// @desc   GET all patient
// @access admin/staff 
export const getPatient = async (req, res) => {
    try {
        // To find All patient
        const patient = await getPatientsQuery({ isActive: true }).sort({ createdAt: -1 })
        return successResponse(
            res,
            STATUS.OK,
            {
                patient
            },
            MESSAGES.PATIENT.PATIENTS_FETCHED
        )
    }
    catch (error) {
        console.log("error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/patient/:id
// @desc   GET single patient
// @access admin/staff 
export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params
        // to get patientDetails  by id
        // called from services
        const patientDetails = await getPatientsByIdQuery(id)
        if (!patientDetails) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { patientDetails },
            MESSAGES.PATIENT.PATIENT_FETCHED
        )
    }
    catch (error) {
        console.log("error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}



// @route   GET/api/patient/find-by-phone/:phone
// @desc   GET patient by phone number
// @access admin/staff 


export const findPatientByPhone = async (req, res) => {
    try {
        const { phone } = req.params;

        const patient = await patientModel
            .findOne({ phone })
            .populate("addresses_id")
            .populate("user_id");

        if (!patient) {
            return errorResponse(res, STATUS.NOT_FOUND, { exists: false });
        }

        return successResponse(res, STATUS.OK, {
            exists: true,
            patient
        });

    } catch (err) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};


// @route   PUT/api/patient/update/:id
// @desc   update patient
// @access admin/staff 
// export const updatePatient = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { updatePatientDetails, updateAddressDetails, updateRegDetails, userUpdates } = req;

//         const currentPatient = await patientModel.findById(id);
//         if (!currentPatient) {
//             return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
//         }
//         console.log(currentPatient, "currrent patient")

//         // const currentReg= await regModel.findById(id);
//         const currentReg = await regModel.findOne({ patient_id: currentPatient._id });
//         const currentUser = await userModel.findById(currentPatient.user_id);

//         if (!currentUser) {
//             return errorResponse(res, STATUS.NOT_FOUND, "User account not found");
//         }
//         // store old email
//         const oldEmail = currentUser.email;
//         let emailChanged = false;


//         // UPDATE ADDRESS
//         if (Object.keys(updateAddressDetails).length > 0) {
//             await addressModel.findByIdAndUpdate(
//                 currentPatient.addresses_id,
//                 { $set: updateAddressDetails },
//                 { new: true }
//             );
//         }

//         // UPDATE REGISTRATION
//         if (Object.keys(updateRegDetails).length > 0) {
//             await regModel.findOneAndUpdate(
//                 { patient_id: currentPatient._id },
//                 { $set: updateRegDetails },
//                 { new: true }
//             );
//         }

//         // UPDATE USER
//         if (Object.keys(userUpdates).length > 0) {
//             if (userUpdates.email && userUpdates.email !== oldEmail) {
//                 emailChanged = true;
//             }
//             await userModel.findByIdAndUpdate(
//                 currentPatient.user_id,
//                 { $set: userUpdates },
//                 { new: true }
//             );
//         }

//         // UPDATE PATIENT
//         const updatedPatient = await patientModel.findByIdAndUpdate(
//             id,
//             { $set: updatePatientDetails },
//             { new: true }
//         );
//         let updatedUser = null; // declare it here
//         if (currentPatient.user_id) {
//             updatedUser = await userModel.findById(currentPatient.user_id).select("name email");
//         }

//         if (emailChanged) {
//             const emailContent = EmailTempForTempPw({
//                 toEmail: userUpdates.email,
//                 tempPassword: "N/A (You can use old password)",   // not needed but template requires field
//                 role: "patient",
//                 name: currentUser.name
//             });

//             await SendMail(userUpdates.email, emailContent);
//         }
//         return successResponse(
//             res,
//             STATUS.OK,
//             {
//                 patientDetails: updatedPatient,
//                 addressDetails: updateAddressDetails,
//                 regDetails: updateRegDetails,
//                 userDetails: updatedUser
//             },
//             MESSAGES.PATIENT.PATIENT_UPDATED
//         );

//     } catch (error) {
//         console.log(error);
//         return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
//     }
// };
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;


        const { updatePatientDetails, updateAddressDetails, updateRegDetails, userUpdates } = req;

        const currentPatient = await patientModel.findById(id);
        if (!currentPatient) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
        }

        const currentReg = await regModel.findOne({ patient_id: currentPatient._id });
        const currentUser = await userModel.findById(currentPatient.user_id);
        if (!currentUser) {
            return errorResponse(res, STATUS.NOT_FOUND, "User account not found");
        }

        // let emailChanged = false;
        // if (userUpdates.email && userUpdates.email !== currentUser.email) {
        //     emailChanged = true;
        // }

         // Check for email update
        if (userUpdates.email && userUpdates.email !== currentUser.email) {
            // Check if another user already has this email
            const existingUser = await userModel.findOne({ email: userUpdates.email });
            if (existingUser) {
                return errorResponse(res, STATUS.BAD_REQUEST, "Email already exists. Please use a different email.");
            }
        }

        // Update address
        if (Object.keys(updateAddressDetails).length > 0) {
            await addressModel.findByIdAndUpdate(
                currentPatient.addresses_id,
                { $set: updateAddressDetails },
                { new: true }
            );
        }

        // Update registration
        if (Object.keys(updateRegDetails).length > 0) {
            await regModel.findOneAndUpdate(
                { patient_id: currentPatient._id },
                { $set: updateRegDetails },
                { new: true }
            );
        }

        // Update user
        // if (Object.keys(userUpdates).length > 0) {
        //     await userModel.findByIdAndUpdate(
        //         currentPatient.user_id,
        //         { $set: userUpdates },
        //         { new: true }
        //     );
        // }

         if (Object.keys(userUpdates).length > 0 || updatePatientDetails.name) {
            const userUpdateData = {
                ...userUpdates,
                ...(updatePatientDetails.name ? { name: updatePatientDetails.name } : {})
            };
            await userModel.findByIdAndUpdate(
                currentPatient.user_id,
                { $set: userUpdateData },
                { new: true }
            );
        }

        // Update patient
        const updatedPatient = await patientModel.findByIdAndUpdate(
            id,
            { $set: updatePatientDetails },
            { new: true }
        );

        // Send email if changed
        if (userUpdates.email && userUpdates.email !== currentUser.email) {
            const emailContent = EmailTempForTempPw({
                toEmail: userUpdates.email,
                tempPassword: "N/A (You can use old password)",
                role: "patient",
                name: currentUser.name
            });
            await SendMail(userUpdates.email, emailContent);
        }

        return successResponse(
            res,
            STATUS.OK,
            {
                patientDetails: updatedPatient,
                addressDetails: updateAddressDetails,
                regDetails: updateRegDetails,
                userDetails: await userModel.findById(currentPatient.user_id).select("name email")
            },
            MESSAGES.PATIENT.PATIENT_UPDATED
        );

    } catch (error) {
        console.log(error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};

// @route   DELETE/api/patient/delete/:id
// @desc   delete patient
// @access admin/staff
export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params
        console.log("Deleting patient ID:", req.params.id);
        // to delete from patientDetails
        // Find patient
        const patient = await patientModel.findById(id);
        if (!patient || !patient.isActive) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
        }

        // Soft delete
        patient.isActive = false;
        patient.deletedAt = new Date();
        await patient.save();
        //Update active registrations' status to "deleted"
        await regModel.updateMany(
            { patient_id: id, status: "active" },
            { $set: { status: "deleted" } }
        );
        await appointmentModel.updateMany(
            { patient_id: id, status: "scheduled" },
            { $set: { status: "cancelled" } }
        )
        return successResponse(
            res,
            STATUS.OK,
            { patient },
            MESSAGES.PATIENT.PATIENT_DELETED
        )
    }
    catch (error) {
        console.log("error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}


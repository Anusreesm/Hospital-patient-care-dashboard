
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import addressModel from "../models/Addresses.js"
import patientModel from "../models/Patient.js"
import regModel from "../models/Registration.js"
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
            bloodBank_id,
            emergency_name,
            emergency_contact,
            registration      //  expect registration details here
        } = req.body
        //  phone number includes +91 
        if (phone && !phone.startsWith("+91")) {
            phone = `+91${phone.replace(/^\+?91/, "").trim()}`;
        }
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
            age, gender, bloodBank_id,
            emergency_name: emergency_name?.trim(),
            emergency_contact: emergency_contact?.trim()
        });
        // populate references separately
        await patient.populate([
            { path: "user_id" },
            { path: "addresses_id" },
            { path: "bloodBank_id", select: "blood_type" }
        ]);
        // 4️ Create registration details (if provided)
        let registrationDoc = null;
        if (registration) {
            registrationDoc = await regModel.create({
                user_id: newUser._id,
                patient_id: patient._id,
                registration_date: registration.registration_date || Date.now(),
                discharge_date: registration.discharge_date || null,
                medical_condition: registration.medical_condition,
                allergies: registration.allergies,
                status: registration.status || "active"
            });
        }
        await session.commitTransaction(); // save all documents
        session.endSession(); // end the session

        //5 Send temp password email
        const emailContent = EmailTempForTempPw({ toEmail: email, tempPassword, role: 'patient',name });
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
                bloodBank: patient.bloodBank_id,
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

// @route   PUT/api/patient/update/:id
// @desc   update patient
// @access admin/staff 
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { updatePatientDetails, patient } = req;

        // Update patient
        const updatedPatient = await patientModel.findByIdAndUpdate(
            id,
            { $set: updatePatientDetails },
            { new: true }
        );

        if (!updatedPatient) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
        }

        // Sync name and email with user model (if provided)
        if (patient.user_id) {
            const userUpdates = {};
            if (updatePatientDetails.name) userUpdates.name = updatePatientDetails.name;
            if (updatePatientDetails.email) userUpdates.email = updatePatientDetails.email.toLowerCase();

            if (Object.keys(userUpdates).length > 0) {
                await userModel.findByIdAndUpdate(patient.user_id, { $set: userUpdates });
            }
        }

        return successResponse(
            res,
            STATUS.OK,
            { patient: updatedPatient },
            MESSAGES.PATIENT.PATIENT_UPDATED
        );

    } catch (error) {
        console.error("Error updating patient:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};

// @route   DELETE/api/patient/delete/:id
// @desc   delete patient
// @access admin/staff
export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params
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
        return successResponse(
            res,
            STATUS.OK,
            { patientDetails },
            MESSAGES.PATIENT.PATIENT_DELETED
        )
    }
    catch (error) {
        console.log("error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}


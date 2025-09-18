export const successResponse= (res, statusCode, data=null, message="Success") =>{
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse= (res, statusCode,  message="Failed") =>{
    return res.status(statusCode).json({
        success: false,
        message       
    });
};

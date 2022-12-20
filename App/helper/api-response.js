'use strict';
require("dotenv").config();
const crypto=require("crypto")
const bcrypt = require('bcrypt');
const iv = crypto.randomBytes(parseInt(process.env.IV));
const sKey = crypto.randomBytes(parseInt(process.env.SKEY));
let encryptedData="";
const jwt=require("jsonwebtoken");

exports.generateAuthTag =(data) => {
    //generat auth tag for uniqueness...
    const cipher = crypto.createCipheriv(process.env.ALGORITHUM, sKey, iv);
     encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString("hex");
    return authTag;
}
exports.encryptData = (data) => {
    //converting to encrypted form
    const authTag=this.generateAuthTag(data);

    const decipher = crypto.createDecipheriv(process.env.ALGORITHUM, sKey, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return {encryptedData,decryptedData,authTag};
}


exports.unAuthorizedResponse = (res, msg) => {
    var data = {
        status: 401,
        message: msg,
    };
    return res.status(401).json(data);
}
exports.generateToken= async (data) =>{
    return await jwt.sign({data},'Wx3!UzwdsxY');
}
exports.comparePassword=async(plainPassword,db_password,callback) => {
    return await bcrypt.compare(plainPassword,db_password).then(res => {
        return res
    });
}
exports.successResponse = (res, msg) => {
    var data = {
        status: 200,
        message: msg
    };
    return res.status(200).json(data);
}
exports.errorRespose = (res, msg) => {
    var data = {
        status: 400,
        message: msg
    };
    return res.status(400).json(data);
}
exports.customSuccessResponseWithData = (res, msg, data,statuscode) => {
    var data = {
        status: statuscode,
        message: msg,
        data: data
    };
    return res.status(statuscode).json(data);
}
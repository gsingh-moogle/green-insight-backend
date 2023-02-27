'use strict';
require("dotenv").config();
const crypto=require("crypto");
const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');
const iv = crypto.randomBytes(parseInt(process.env.IV));
const sKey = crypto.randomBytes(parseInt(process.env.SKEY));
const CryptoKey = process.env.CRYPTO_JS;
let encryptedData="";
const SQLToken = process.env.MY_SQL_TOKEN;
const jwt=require("jsonwebtoken");

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), CryptoKey).toString();
}

exports.generateAuthTag =(data) => {
    //generat auth tag for uniqueness...
    const cipher = crypto.createCipheriv(process.env.ALGORITHUM, sKey, iv);
     encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString("hex");
    return authTag;
}
exports.encryptDatabaseData = (data) => {
    var dc = crypto.createDecipheriv("aes-128-ecb", convertCryptKey(SQLToken), "");
    return dc.update(data, 'hex', 'utf8') + dc.final('utf8');
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
//data: encryptData(data)
    return res.status(statuscode).json(data);
}

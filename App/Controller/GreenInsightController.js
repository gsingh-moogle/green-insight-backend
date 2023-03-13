const sequelize = require('sequelize');
const Op = sequelize.Op;
const Response=require("../helper/api-response");
const SQLToken = process.env.MY_SQL_TOKEN;
const AES = require('mysql-aes')
const DB = require("../models");

const createOrUpdateUser = (values,condition) => {
    DB.main_db.models.UserOtp.findOne({ where: condition }).then(function(obj) {
        // update
        if(obj)
            return obj.update(values);
        // insert
        return DB.main_db.models.UserOtp.create(values);
    })
}

exports.login=async(req,res) => {
    try {
        var {email,_password}=req.body;
        //code...
        //console.log(type,email,password);return 
        let getUser=await DB.main_db.models.User.findOne({
            attributes: ['id','name','email','password','role','createdAt'],
            where:{email:AES.encrypt(email, SQLToken)},
            include: [
            {
                model: DB.main_db.models.Region,
                attributes: ['id','name']
            },{
                model: DB.main_db.models.Profile,
                attributes: ['first_name','last_name','country_code','phone_number','image','status']
            },{
                model: DB.main_db.models.Company,
                attributes: ['name','db_name','logo']
            }]
        });
        //check password is matched or not then exec
        if(getUser){
            console.log(getUser.Region);
            getUser.email = (getUser.email)?AES.decrypt(getUser.email, SQLToken):null;
            getUser.name = (getUser.name)?AES.decrypt(getUser.name, SQLToken):null;
            getUser.Profile.phone_number = (getUser.Profile.phone_number)?AES.decrypt(getUser.Profile.phone_number, SQLToken):null;
            getUser.Profile.first_name = (getUser.Profile.first_name)?AES.decrypt(getUser.Profile.first_name, SQLToken):null;
            getUser.Profile.last_name = (getUser.Profile.last_name)?AES.decrypt(getUser.Profile.last_name, SQLToken):null;
            getUser.Region.name = (getUser.Region.name)?AES.decrypt(getUser.Region.name, SQLToken):null;
            getUser.Company.name = (getUser.Company.name)?AES.decrypt(getUser.Company.name, SQLToken):null;
            getUser.Company.db_name = (getUser.Company.db_name)?AES.decrypt(getUser.Company.db_name, SQLToken):null;
            getUser.Company.logo = (getUser.Company.logo)?AES.decrypt(getUser.Company.logo, SQLToken):null;
            if(getUser?.role==0){
                if(getUser) {
                    let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                    if(checkPasswordExists){
                        if(getUser.Profile.phone_number && getUser.Profile.country_code){
                            let code = Math.floor(100000 + Math.random() * 900000)
                            code = 903412;
                            let whereCondition = {
                                user_id : getUser.id,
                                phone_number: AES.encrypt(getUser.Profile.phone_number, SQLToken),
                            };
                            let updateValues = {
                                user_id : getUser.id,
                                phone_number : sequelize.literal('HEX( aes_encrypt('+getUser.Profile.phone_number+',"'+SQLToken+'") )'),
                                otp : sequelize.literal('HEX( aes_encrypt('+code+',"'+SQLToken+'") )'),
                                status : 0,
                            }
                            createOrUpdateUser(updateValues,whereCondition);
                            //generate token for authentication
                            //new code
                            let messageData = {
                                message: 'Your verification code is :'+code,
                                phone_number: `${getUser.Profile.country_code}${getUser.Profile.phone_number}`
                            }
                        //   let sendMessage=await Twilio.sendVerificationCode(messageData);
                        // if(sendMessage) {
                                return Response.customSuccessResponseWithData(res,'Verification code send to registered phone number.',{},200)
                            // } else {
                            //     return Response.errorRespose(res,'Error while sending verification code to registered phone number.');
                            // }
                        } else {
                            return Response.errorRespose(res,"User phone number not found!");
                        }   
                    } else {return Response.errorRespose(res,"Password should be matched");}
                } else {
                    return Response.errorRespose(res,'Email address is not exists');
                }
            } else if(getUser.role==1) {
            //check password is matched or not then exec
                let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                if(checkPasswordExists){
                    if(getUser.Profile.phone_number && getUser.Profile.country_code){
                        let code = Math.floor(100000 + Math.random() * 900000)
                        code = 903412;
                        let whereCondition = {
                            user_id : getUser.id,
                            phone_number: AES.encrypt(getUser.Profile.phone_number, SQLToken),
                        };
                        let updateValues = {
                            user_id : getUser.id,
                            phone_number : sequelize.literal('HEX( aes_encrypt('+getUser.Profile.phone_number+',"'+SQLToken+'") )'),
                            otp : sequelize.literal('HEX( aes_encrypt('+code+',"'+SQLToken+'") )'),
                            status : 0,
                        }
                        createOrUpdateUser(updateValues,whereCondition);
                        //generate token for authentication
                        
                        let messageData = {
                            message: 'Your verification code is :'+code,
                            phone_number: `${getUser.Profile.country_code}${getUser.Profile.phone_number}`
                        }
                    // let sendMessage=await Twilio.sendVerificationCode(messageData);
                        //generate token for authentication
                    //  if(sendMessage) {
                            return Response.customSuccessResponseWithData(res,'Verification code send to registered phone number.',{},200);
                        // } else {
                        //     return Response.errorRespose(res,'Error while sending verification code to registered phone number.');
                        // }
                    } else {
                        return Response.errorRespose(res,"User phone number not found!");
                    }
                } else {return Response.errorRespose(res,"Password are not matched");}
            } else {
                return Response.errorRespose(res,'Email address is not exists');
            } 
        } else { return Response.errorRespose(res,'Email is not Exists, Please Check');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.verifyOtp=async(req,res) => {
    try {
            var {otp,email}=req.body;

            let user = await DB.main_db.models.User.findOne({
                    attributes: ['id','name','email','role','createdAt'],
                    where:{email:AES.encrypt(email, SQLToken)},
                    include: [
                    {
                        model: DB.main_db.models.Region,
                        attributes: ['id','name']
                    },{
                        model: DB.main_db.models.Profile,
                        attributes: ['first_name','last_name','country_code','phone_number','image','status']
                    },{
                        model: DB.main_db.models.Company,
                        attributes: ['name','db_name','logo']
                    }]
              });

            // let data =   Response.encryptDatabaseData(user.email);
            // console.log('dataEnc',data);
            if(otp && user) {
                user.email = (user.email)?AES.decrypt(user.email, SQLToken):null;
                user.name = (user.name)?AES.decrypt(user.name, SQLToken):null;
                user.Profile.phone_number = (user.Profile.phone_number)?AES.decrypt(user.Profile.phone_number, SQLToken):null;
                user.Profile.first_name = (user.Profile.first_name)?AES.decrypt(user.Profile.first_name, SQLToken):null;
                user.Profile.last_name = (user.Profile.last_name)?AES.decrypt(user.Profile.last_name, SQLToken):null;
                user.Region.name = (user.Region.name)?AES.decrypt(user.Region.name, SQLToken):null;
                user.Company.name = (user.Company.name)?AES.decrypt(user.Company.name, SQLToken):null;
                user.Company.db_name = (user.Company.db_name)?AES.decrypt(user.Company.db_name, SQLToken):null;
                user.Company.logo = (user.Company.logo)?AES.decrypt(user.Company.logo, SQLToken):null;
                let condition = {
                    user_id:user.id,
                    phone_number : AES.encrypt(user.Profile.phone_number, SQLToken)
                }
                let otpData = await DB.main_db.models.UserOtp.findOne({ 
                    attributes: ['otp'],
                    where: condition });                   
                //check password is matched or not then exec
                if(otpData){
                    otpData.otp = AES.decrypt(otpData.otp, SQLToken);
                    if(otpData.otp == otp){
                        let token=await Response.generateToken(user);
                        user.dataValues.token=token;
                        return Response.customSuccessResponseWithData(res,'Verification code is valid.',user,200)
                    } else {
                        return Response.errorRespose(res,'Verification code is not valid!');
                    }  
                } else { return Response.errorRespose(res,'Verification code is not valid!');}
            } else {
                return Response.errorRespose(res,'No Record Found!');
            }
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}





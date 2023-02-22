const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Region =require("../models").Region;
const Profile =require("../models").Profile;
const UserOtp =require("../models").UserOtp;
const Response=require("../helper/api-response");
const SQLToken = process.env.MY_SQL_TOKEN;
const AES = require('mysql-aes')

const createOrUpdateUser = (values,condition) => {
    UserOtp.findOne({ where: condition }).then(function(obj) {
        // update
        if(obj)
            return obj.update(values);
        // insert
        return UserOtp.create(values);
    })
}

exports.login=async(req,res) => {
    try {
        var {email,_password}=req.body;
            //code...
            //console.log(type,email,password);return 
            let getUser=await User.findOne({
                attributes: ['id','name','email','password','role','createdAt'],
                where:{email:AES.encrypt(email, SQLToken)},
                include: [
                {
                    model: Region,
                    attributes: ['id','name']
                },{
                    model: Profile,
                    attributes: ['first_name','last_name','country_code','phone_number','image','status']
                }]
            });
            //check password is matched or not then exec
            if(getUser){
                getUser.email = AES.decrypt(getUser.email, SQLToken);
                getUser.Profile.phone_number = AES.decrypt(getUser.Profile.phone_number, SQLToken);
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

            let user = await User.findOne({
                    attributes: ['id','name','email','password','role','createdAt'],
                    where:{email:AES.encrypt(email, SQLToken)},
                    include: [
                    {
                        model: Region,
                        attributes: ['id','name']
                    },{
                        model: Profile,
                        attributes: ['first_name','last_name','country_code','phone_number','image','status']
                    }]
              });

            // let data =   Response.encryptDatabaseData(user.email);
            // console.log('dataEnc',data);
            if(otp && user) {
                user.email = AES.decrypt(user.email, SQLToken);
                user.Profile.phone_number = AES.decrypt(user.Profile.phone_number, SQLToken);
                let condition = {
                    user_id:user.id,
                    phone_number : AES.encrypt(user.Profile.phone_number, SQLToken)
                }
                let otpData = await UserOtp.findOne({ 
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





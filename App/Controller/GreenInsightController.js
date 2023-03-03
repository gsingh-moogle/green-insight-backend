const User = require("../models").User;
const Region =require("../models").Region;
const Profile =require("../models").Profile;
const UserOtp =require("../models").UserOtp;
const e = require("express");
const Response=require("../helper/api-response");

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
              //  attributes: ['id','name','email','role','createdAt'],
                where:{email:email},
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
                 if(getUser?.role==0){
                if(getUser) {
                    let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                    if(checkPasswordExists){
                        if(getUser.Profile.phone_number && getUser.Profile.country_code){
                            let code = Math.floor(100000 + Math.random() * 900000)
                            code = 903142
                            let whereCondition = {
                                user_id : getUser.id,
                                phone_number : getUser.Profile.phone_number
                            };
                            let updateValues = {
                                user_id : getUser.id,
                                phone_number : getUser.Profile.phone_number,
                                otp : code,
                                status : 0,
                            }
                            createOrUpdateUser(updateValues,whereCondition);
                            //generate token for authentication
                            //new code
                            
                            let messageData = {
                                message: 'Your verification code is :'+code,
                                phone_number: `${getUser.Profile.country_code}${getUser.Profile.phone_number}`
                            }
                           
                            return Response.customSuccessResponseWithData(res,'Verification code send to registered phone number.',{},200)
                            
                        } else {
                            return Response.errorRespose(res,"User phone number not found!");
                        }   
                    } else {return Response.errorRespose(res,"Password should be matched");}
                } else {
                    return Response.errorRespose(res,'Email address is not exists');
                }
            } else {
                //code...
            let getUser=await User.findOne({
               // attributes: ['id','name','email','role','createdAt'],
                where:{email:email},
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
            if(getUser.role==1){
                if(getUser) {
                    let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                    if(checkPasswordExists){
                        if(getUser.Profile.phone_number && getUser.Profile.country_code){
                            let code = Math.floor(100000 + Math.random() * 900000)
                            code = 903142
                            let whereCondition = {
                                user_id : getUser.id,
                                phone_number : getUser.Profile.phone_number
                            };
                            let updateValues = {
                                user_id : getUser.id,
                                phone_number : getUser.Profile.phone_number,
                                otp : code,
                                status : 0,
                            }
                            createOrUpdateUser(updateValues,whereCondition);
                            //generate token for authentication
                            
                            let messageData = {
                                message: 'Your verification code is :'+code,
                                phone_number: `${getUser.Profile.country_code}${getUser.Profile.phone_number}`
                            }
                            
                                return Response.customSuccessResponseWithData(res,'Verification code send to registered phone number.',{},200);
                            
                        } else {
                            return Response.errorRespose(res,"User phone number not found!");
                        }
                    } else {return Response.errorRespose(res,"Password are not matched");}
                } else {
                    return Response.errorRespose(res,'Email address is not exists');
                }
            } else {
                return Response.errorRespose(res,'something went wrong')
            }
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
                //  attributes: ['id','name','email','role','createdAt'],
                  where:{email:email},
                  include: [
                  {
                      model: Region,
                      attributes: ['id','name']
                  },{
                      model: Profile,
                      attributes: ['first_name','last_name','country_code','phone_number','image','status']
                  }]
              });
            if(otp && user) {
                let condition = {
                    user_id:user.id,
                    phone_number: user.Profile.phone_number
                }
                console.log('condition',condition);
                let otpData = await UserOtp.findOne({ where: condition });                   
                //check password is matched or not then exec
                if(otpData){
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





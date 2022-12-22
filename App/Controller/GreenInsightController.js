const User =require("../models").User;

const Response=require("../helper/api-response");


exports.login=async(req,res) => {
    try {
        var {email,_password}=req.body;
            //code...
            //console.log(type,email,password);return 
            let getUser=await User.findOne({where:{email:email}});
            //check password is matched or not then exec
            if(getUser){
                 if(getUser?.role==0){
                if(getUser) {
                    let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                    if(checkPasswordExists){
                        //generate token for authentication
                        let token=await Response.generateToken(getUser);
                        if(token) {
                            getUser.dataValues.token=token;
                            return Response.customSuccessResponseWithData(res,'User has been Login by Sustainable Account',getUser,200)
                        }
                    } else {return Response.errorRespose(res,"Password should be matched");}
                } else {
                    return Response.errorRespose(res,'Email address is not exists');
                }
            } else {
                //code...
            let getUser=await User.findOne({where:{email:email}});
            //check password is matched or not then exec
            if(getUser.role==1){
                if(getUser) {
                    let checkPasswordExists= await Response.comparePassword(req.body.password,getUser.password,async (res) => {return await res; });
                    if(checkPasswordExists){
                        //generate token for authentication
                        let token=await Response.generateToken(getUser);
                        if(token) {
                            getUser.dataValues.token=token;
                            return Response.customSuccessResponseWithData(res,'User has been Login by Regional Account',getUser,200)
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

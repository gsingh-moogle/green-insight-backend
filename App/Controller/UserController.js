const Profile =require("../models").Profile;
const User =require("../models").Users;
const Response=require("../helper/api-response");

exports.getProfileDetails=async(req,res) => {
    try {
            //console.log(type,email,password);return 
            let getProfile = await Profile.findOne({
                where:{id:1}
                });
            //check password is matched or not then exec
            if(getProfile){
                return Response.customSuccessResponseWithData(res,'User Profile',getProfile,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}



const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const User =require("../models").Users;
const Response=require("../helper/api-response");

exports.getProjectCount=async(req,res) => {
    try {
        var {region_id}=req.body;
            //console.log(type,email,password);return 
        let getProject=await Project.findOne({
                attributes: [[ sequelize.literal('( SELECT SUM(status=0) )'),'Inactive'],[ sequelize.literal('( SELECT SUM(status=1) )'),'Active']],
                where:{region_id:region_id}
            });
            
        //check password is matched or not then exec
        if(getProject){
            return Response.customSuccessResponseWithData(res,'Active/Inactive count',getProject,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.saveProject=async(req,res) => {
    try {
        var {region_id, project_name, description, start_date, end_date}=req.body;
            //console.log(type,email,password);return 
        const project = await Project.create({region_id:region_id, project_name: project_name, desc: description, start_date: start_date, end_date:end_date });

            
        //check password is matched or not then exec
        if(project){
            return Response.customSuccessResponseWithData(res,'Project Created Successfully',project,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}



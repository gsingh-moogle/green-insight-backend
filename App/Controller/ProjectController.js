const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const ProjectManager =require("../models").ProjectManager;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const { check, validationResult } = require('express-validator');
const Validations=require("../helper/api-validator");
const moment = require('moment');
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
        const errors = Validations.resultsValidator(req);
        if (errors.length > 0) {
            return res.status(400).json({
            method: req.method,
            status: res.statusCode,
            error: errors
            })
        }
        var {region_id, project_name, description, start_date, end_date, manager_name, manager_email}=req.body;
            //console.log(type,email,password);return 
        const ManagerData = await ProjectManager.create({
            name:manager_name, 
            email: manager_email,
            }).then(function(obj) {
                return obj.dataValues;
            }
        );
        if(ManagerData){
            let startDate = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
            let endDate = moment(end_date).format("YYYY-MM-DD HH:mm:ss");
            const ProjectData = await Project.create({
            region_id:region_id,
            manager_id :  ManagerData.id,
            project_name: project_name,
            desc: description,
            start_date: startDate,
            end_date:endDate });

            if(ProjectData){
                return Response.customSuccessResponseWithData(res,'Project Created Successfully',ProjectData,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
        } else { return Response.errorRespose(res,'Error while creating project!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}



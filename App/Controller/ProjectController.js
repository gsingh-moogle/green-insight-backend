const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const ProjectManager =require("../models").ProjectManager;
const ProjectFeedback =require("../models").ProjectFeedback;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const { check, validationResult } = require('express-validator');
const Validations=require("../helper/api-validator");
const moment = require('moment');
const randomstring = require("randomstring");
exports.getProjectCount=async(req,res) => {
    try {
        var {region_id, year}=req.body;
        const where = {}
        if (region_id) {
            where[Op.and] = []
            if (region_id) {
                where[Op.and].push({region_id: region_id});
            }
            if (year) {
                year = parseInt(year);
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year));
            } 
        }
        console.log('region_id',region_id);
        let getProject= await Project.findOne({
            attributes: [[ sequelize.literal('( SELECT SUM(status=0) )'),'Inactive'],[ sequelize.literal('( SELECT SUM(status=1) )'),'Active'],[ sequelize.literal('( SELECT SUM(id) )'),'Total']],
            where:where
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

        let randomString = randomstring.generate(10);
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
                project_unique_id : randomString,
                region_id:region_id,
                manager_id :  ManagerData.id,
                project_name: project_name,
                desc: description,
                start_date: startDate,
                status:1,
                end_date:endDate });

            if(ProjectData){
                return Response.customSuccessResponseWithData(res,'Project Created Successfully',ProjectData,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
        } else { return Response.errorRespose(res,'Error while creating project!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.saveProjectRating=async(req,res) => {
    try {
        const errors = Validations.resultsValidator(req);
        if (errors.length > 0) {
            return res.status(400).json({
            method: req.method,
            status: res.statusCode,
            error: errors
            })
        }
        var {project_id, description, rating}=req.body;
        const RatingData = await ProjectFeedback.create({
            project_id:project_id,
            user_id:req.currentUser.data.id,
            rating: rating,
            description:description
            }).then(function(obj) {
                return obj.dataValues;
            }
        );
        if(RatingData){
            return Response.customSuccessResponseWithData(res,'Project Rating Submited Successfully',RatingData,200)
        } else { return Response.errorRespose(res,'Error while submiting project rating!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


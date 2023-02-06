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
const Decarb =require("../models").DecarbRecommendation;

exports.getProjectCount=async(req,res) => {
    try {
        var {region_id, year}=req.body;
        const where = {}
        if (region_id || year) {
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
            attributes: [[ sequelize.literal('( SELECT SUM(status=0) )'),'Inactive'],[ sequelize.literal('( SELECT SUM(status=1) )'),'Active'],[ sequelize.literal('( SELECT count(id) )'),'Total']],
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
        var {region_id, project_name, description, start_date, end_date, manager_name, manager_email, type, decarb_id, customize_emission, emission_percent, actual_emission}=req.body;

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
                decarb_id: decarb_id,
                manager_id :  ManagerData.id,
                project_name: project_name,
                desc: description,
                start_date: startDate,
                customize_emission:customize_emission,
                emission_percent:emission_percent,
                actual_emission:actual_emission,
                status:1,
                type : type,
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

exports.getProjectList=async(req,res) => {
    try {
        var {project_id, description, rating, project_name, project_unique_id, year, lever, search}=req.body;

        const where = {}
        if (project_name || project_unique_id || year || lever || search) {
            where[Op.and] = []
            if (project_name) {
                where[Op.and].push({
                    project_name: project_name
                })
            }
            if (search) {
                where[Op.and].push({
                    project_name: {
                        [Op.like]: `%${search}%`
                      }
                })
            }
            if (project_unique_id) {
                where[Op.and].push({
                    project_unique_id: project_unique_id
                })
            }
            if (lever) {
                where[Op.and].push({
                    type: lever
                })
            }
            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year))
            }
        }
        const projectData = await Project.findAll({
            attributes: ['id',"project_unique_id","region_id","decarb_id","project_name","start_date",
            "end_date","desc","customize_emission","emission_percent","actual_emission","type",
            [sequelize.fn('quarter', sequelize.col('createdAt')), 'quarter'],[sequelize.fn('year', sequelize.col('createdAt')), 'year']],
            where:where,
            raw:true
        });

        if(projectData){
            let modal_shift = [];
            let alternative_fuel = [];
            for(const property of projectData) {
                let DecarbRecommendations = await Decarb.findOne({
                    where:{recommended_type:'original',type:property.type,decarb_id:property.decarb_id}
                });
                property.DecarbRecommendations = DecarbRecommendations;
                if(property.type == 'modal_shift') {
                    modal_shift.push(property);
                } else {
                    alternative_fuel.push(property);
                }
            }
            let data = {
                modal_shift : modal_shift,
                alternative_fuel : alternative_fuel
            }
            return Response.customSuccessResponseWithData(res,'Project listing fetched Successfully',data,200)
        } else { return Response.errorRespose(res,'Error while fetching project listing!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getProjectSearchList=async(req,res) => {
    try {
        const projectData = await Project.findAll({
            attributes:['project_name','project_unique_id']
        });

        if(projectData){
            return Response.customSuccessResponseWithData(res,'Project Search listing fetched Successfully',projectData,200)
        } else { return Response.errorRespose(res,'Error while fetching project Search listing!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.deleteProject=async(req,res) => {
    try {
        var {project_id}=req.body;
        const projectData = await Project.destroy({
            where:{id:project_id}
        });

        if(projectData){
            return Response.customSuccessResponseWithData(res,'Project deleted successfully.',projectData,200)
        } else { return Response.errorRespose(res,'Error deleting project!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}
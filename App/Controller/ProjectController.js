const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const ProjectManager =require("../models").ProjectManager;
const ProjectFeedback =require("../models").ProjectFeedback;
const Region =require("../models").Region;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const { check, validationResult } = require('express-validator');
const Validations=require("../helper/api-validator");
const moment = require('moment');
const randomstring = require("randomstring");
const Decarb =require("../models").DecarbRecommendation;
const AES = require('mysql-aes');
const SQLToken = process.env.MY_SQL_TOKEN;

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
        let getProject= await req.db.Project.findOne({
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
        const ManagerData = await req.db.ProjectManager.create({
            name:AES.encrypt(manager_name, SQLToken),
            email: AES.encrypt(manager_email, SQLToken)
            }).then(function(obj) {
                return obj.dataValues;
            }
        );
        if(ManagerData){
            let startDate = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
            let endDate = moment(end_date).format("YYYY-MM-DD HH:mm:ss");
            const ProjectData = await req.db.Project.create({
                project_unique_id : randomString,
                region_id:region_id,
                decarb_id: decarb_id,
                manager_id :  ManagerData.id,
                project_name: (project_name)?AES.encrypt(project_name, SQLToken):null,
                desc: (description)?AES.encrypt(description, SQLToken):null,
                start_date: startDate,
                customize_emission:(customize_emission)?AES.encrypt(customize_emission, SQLToken):null,
                emission_percent:(emission_percent)?AES.encrypt(emission_percent, SQLToken):null,
                actual_emission:(actual_emission)?AES.encrypt(actual_emission, SQLToken):null,
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
        const RatingData = await req.db.ProjectFeedback.create({
            project_id:project_id,
            user_id:req.currentUser.data.id,
            rating: rating,
            description:AES.encrypt(description, SQLToken),
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
        var {project_id, description, rating, project_name, project_unique_id, year, lever, search, region_id}=req.body;

        const where = {}
        if (project_name || project_unique_id || year || lever || search || region_id) {
            where[Op.and] = []

            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
            if (project_name) {
                where[Op.and].push(
                    sequelize.where(sequelize.literal('( AES_DECRYPT(UNHEX(project_name),"'+SQLToken+'") )'),project_name)
                    )
            }
            if (search) {
                where[Op.and].push(sequelize.where(sequelize.literal('( AES_DECRYPT(UNHEX(project_name),"'+SQLToken+'") )'), {
                        [Op.like]: `%${search}%`
                }
                ))
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
        const projectData = await req.db.Project.findAll({
            attributes: ['id',"project_unique_id","region_id","decarb_id","project_name","start_date",
            "end_date","desc","customize_emission","emission_percent","actual_emission","type",
            [sequelize.fn('quarter', sequelize.col('end_date')), 'quarter'],[sequelize.fn('year', sequelize.col('end_date')), 'year']],
            where:where,
            raw:true
        });

        if(projectData){
            let modal_shift = [];
            let alternative_fuel = [];
            for(const property of projectData) {
                console.log('property',property);
                property.project_name = (property.project_name)?AES.decrypt(property.project_name, SQLToken):property.project_name;
                property.actual_emission = (property.actual_emission)?AES.decrypt(property.actual_emission, SQLToken):property.actual_emission;
                property.customize_emission = (property.customize_emission)?AES.decrypt(property.customize_emission, SQLToken):property.customize_emission;
                property.emission_percent = (property.emission_percent)?AES.decrypt(property.emission_percent, SQLToken):property.emission_percent;
                property.desc = (property.desc)?AES.decrypt(property.desc, SQLToken):property.desc;

                let DecarbRecommendations = await req.db.DecarbRecommendation.findOne({
                    where:{recommended_type:'original',type:AES.encrypt(property.type, SQLToken),decarb_id:property.decarb_id}
                });
                property.DecarbRecommendations = null;
                if(DecarbRecommendations) {
                    DecarbRecommendations.lane_name = (DecarbRecommendations.lane_name)?AES.decrypt(DecarbRecommendations.lane_name, SQLToken):DecarbRecommendations.lane_name;
                    DecarbRecommendations.origin = (DecarbRecommendations.origin)?AES.decrypt(DecarbRecommendations.origin, SQLToken):DecarbRecommendations.origin;
                    DecarbRecommendations.destination = (DecarbRecommendations.destination)?AES.decrypt(DecarbRecommendations.destination, SQLToken):DecarbRecommendations.destination;
                    DecarbRecommendations.LOB = (DecarbRecommendations.LOB)?AES.decrypt(DecarbRecommendations.LOB, SQLToken):DecarbRecommendations.LOB;
                    DecarbRecommendations.fuel_type = (DecarbRecommendations.fuel_type)?AES.decrypt(DecarbRecommendations.fuel_type, SQLToken):DecarbRecommendations.fuel_type;
                    DecarbRecommendations.emissions = (DecarbRecommendations.emissions)?AES.decrypt(DecarbRecommendations.emissions, SQLToken):DecarbRecommendations.emissions;

                    DecarbRecommendations.grs_wgt_qty = (DecarbRecommendations.grs_wgt_qty)?AES.decrypt(DecarbRecommendations.grs_wgt_qty, SQLToken):DecarbRecommendations.grs_wgt_qty;
                    DecarbRecommendations.loaded_miles = (DecarbRecommendations.loaded_miles)?AES.decrypt(DecarbRecommendations.loaded_miles, SQLToken):DecarbRecommendations.loaded_miles;
                    DecarbRecommendations.uploaded_miles = (DecarbRecommendations.uploaded_miles)?AES.decrypt(DecarbRecommendations.uploaded_miles, SQLToken):DecarbRecommendations.uploaded_miles;
                    DecarbRecommendations.mpg = (DecarbRecommendations.mpg)?AES.decrypt(DecarbRecommendations.mpg, SQLToken):DecarbRecommendations.mpg;
                    DecarbRecommendations.fuel_use = (DecarbRecommendations.fuel_use)?AES.decrypt(DecarbRecommendations.fuel_use, SQLToken):DecarbRecommendations.fuel_use;
                    DecarbRecommendations.type = (DecarbRecommendations.type)?AES.decrypt(DecarbRecommendations.type, SQLToken):DecarbRecommendations.type;
                    property.DecarbRecommendations = DecarbRecommendations;
                }

                
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
        const projectData = await req.db.Project.findAll({
            attributes:['project_name','project_unique_id']
        });
        // const RegionData = await Region.findAll({
        //     attributes:['name']
        // });

        if(projectData){
            for(const property of projectData) {
                property.project_name = (property.project_name)?AES.decrypt(property.project_name, SQLToken):null;
            }
            // let data = {
            //     project :projectData,
            //     region : RegionData
            // }
            return Response.customSuccessResponseWithData(res,'Project Search listing fetched Successfully',projectData,200)
        } else { return Response.errorRespose(res,'Error while fetching project Search listing!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.deleteProject=async(req,res) => {
    try {
        var {project_id}=req.body;
        const projectData = await req.db.Project.destroy({
            where:{id:project_id}
        });
        
        if(projectData){
            return Response.customSuccessResponseWithData(res,'Project deleted successfully.',projectData,200)
        } else { return Response.errorRespose(res,'Error deleting project!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}
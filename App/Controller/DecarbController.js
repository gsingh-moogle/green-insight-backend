const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const Emission =require("../models").Emission;
const Decarb =require("../models").DecarbRecommendation;
const Helper=require("../helper/common-helper");
const moment = require('moment');

exports.getRecommendedLevers=async(req,res) => {
    try {
        const Emissions = await Emission.findOne({
            attributes: [[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],[ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'emission_per_ton']],
            where:{region_id:8,source:'SALT LAKE CITY,UT',destination:'PERRIS, CA'},
            raw:true
        });
            
        //check password is matched or not then exec
        if(Emissions){
            let data = {
                intensity : (Helper.roundToDecimal(Emissions.emission/Emissions.emission_per_ton)).toFixed(1),
                lane : 2,
                vendor : 1,
                tonnage : 0
            }
            return Response.customSuccessResponseWithData(res,'Recommended levers data.',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getCustomizeLevers=async(req,res) => {
    try {
        let laneArray = ['BAKERSFIELD,CA_MODESTO, CA','SALT LAKE CITY,UT_PERRIS, CA'];
        let data = {};
        let date = moment();
        let currentData = date.format("YYYY-MM-DD");
        let pastData = date.subtract(1, "year").format("YYYY-MM-DD");
        let customizeData = await Decarb.findAll({
            order : [['lane_name','desc']]
        });
        // for (const property in laneArray) {
        //     let original = await Decarb.findAll({
        //         where:{recommended_type:'original',lane_name:property}
        //     });
        //     let recommended = await Decarb.findAll({
        //         where:{recommended_type:'recommended_type',lane_name:property}
        //     });
        //     if()
        // }
        
            
        //check password is matched or not then exec
        let laneData = {};
        if(customizeData){
            for (const property of customizeData) {
                if (laneData[property.lane_name]) {
                    if(property.type == 'alternative_fuel') {
                        if(property.recommended_type == 'original') {
                            laneData[property.lane_name][property.type]['original_emission'] += property.emissions;
                        } else {
                            laneData[property.lane_name][property.type]['customize_emission'] += property.emissions;
                            laneData[property.lane_name][property.type]['route'].push({
                                origin :property.origin,
                                destination : property.destination,
                                type : property.LOB,
                                emissions : property.emissions,
                            });
                        }
                    } else {
                        if(property.recommended_type == 'original') {
                            laneData[property.lane_name][property.type]['original_emission'] += property.emissions;
                        } else {
                            laneData[property.lane_name][property.type]['customize_emission'] += property.emissions;
                            laneData[property.lane_name][property.type]['route'].push({
                                origin :property.origin,
                                destination : property.destination,
                                type : property.LOB,
                                emissions : property.emissions,
                            });
                        }
                    }
                } else {
                    let original_emission = 0;
                    let customize_emission = 0;
                    laneData[property.lane_name] ={};
                    let route = []
                 //   laneData[property.lane_name][property.type] ={};
                    let laneEmissionData = await Emission.findOne({
                        attributes: ['id', [ sequelize.literal('( SELECT SUM(emission) DIV SUM(total_ton_miles) )'),'intensity'],
                        [ sequelize.literal('( SELECT SUM(shipments) )'),'shipments']],
                        where: {'source':property.origin,'destination':property.destination,date: {
                            [Op.between]: [pastData, currentData],
                        }},
                        raw:true
                    }); 
                    if(property.type == 'alternative_fuel') {
                        if(property.recommended_type == 'original') {
                            original_emission = property.emissions;
                        } else {
                            route.push({
                                origin :property.origin,
                                destination : property.destination
                            })
                            customize_emission = property.emissions;
                        } 
                        
                        laneData[property.lane_name][property.type] = {
                            name : property.lane_name,
                            origin : property.origin,
                            destination : property.destination,
                            original_emission : original_emission,
                            customize_emission : customize_emission,
                            route : route,
                            shipments : laneEmissionData.shipments,
                            intensity : laneEmissionData.intensity,
                            type : property.type
                        }
                    } else {
                        if(property.recommended_type == 'original') {
                            original_emission = property.emissions;
                        } else {
                            customize_emission = property.emissions;
                            route.push({
                                origin :property.origin,
                                destination : property.destination
                            })
                        } 
                        laneData[property.lane_name][property.type] = {
                            name : property.lane_name,
                            origin : property.origin,
                            destination : property.destination,
                            original_emission : original_emission,
                            customize_emission : customize_emission,
                            route : route,
                            shipments : laneEmissionData.shipments,
                            intensity : laneEmissionData.intensity,
                            type : property.type
                        }
                    }
                    
                }
            }


            return Response.customSuccessResponseWithData(res,'Recommended levers data.',laneData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}
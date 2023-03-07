const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const Emission =require("../models").Emission;
const Decarb =require("../models").DecarbRecommendation;
const Helper=require("../helper/common-helper");
const moment = require('moment');
const SQLToken = process.env.MY_SQL_TOKEN;
const AES = require('mysql-aes')

exports.getRecommendedLevers=async(req,res) => {
    try {
        let {region_id}=req.body;
        const where = {source:AES.encrypt('SALT LAKE CITY,UT', SQLToken),destination:AES.encrypt('PERRIS, CA', SQLToken)}
        if(region_id === undefined || region_id == "") {
            region_id = 8;
        }
        if(region_id != 8) {
            return Response.errorRespose(res,'No Record Found!');
        }
        if (region_id) {
            where[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
        }
        const Emissions = await req.db.Emission.findOne({
            attributes: [[ sequelize.literal('( SELECT SUM(AES_DECRYPT(UNHEX(emission),"'+SQLToken+'")) )'),'emission'],[ sequelize.literal('( SELECT SUM(AES_DECRYPT(UNHEX(total_ton_miles),"'+SQLToken+'")) )'),'emission_per_ton']],
            where:where,
            raw:true
        });
            
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
        let customizeData = await req.db.DecarbRecommendation.findAll({
            order : [[sequelize.literal('( AES_DECRYPT(UNHEX(lane_name),"'+SQLToken+'") )'),'desc']]
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
                // console.log('emissions',AES.decrypt(property.emissions, SQLToken));
                // return false;
                let propertyLaneName = AES.decrypt(property.lane_name, SQLToken);
                let propertyOrigin = AES.decrypt(property.origin, SQLToken);
                let propertyDestination = AES.decrypt(property.destination, SQLToken);
                let propertyType = AES.decrypt(property.LOB, SQLToken);
                let propertyEmissions = (property.emissions)?parseFloat(AES.decrypt(property.emissions, SQLToken)):0;
                let propertyFuelType = AES.decrypt(property.fuel_type, SQLToken);
                property.type = (property.type)?AES.decrypt(property.type, SQLToken):property.type;
                if (laneData[propertyLaneName]) {
                    
                    if(property.type == 'alternative_fuel') {
                        if(property.recommended_type == 'original') {
                            laneData[propertyLaneName][property.type]['original_emission'] += propertyEmissions;
                        } else {
                            laneData[propertyLaneName][property.type]['customize_emission'] += propertyEmissions;
                            laneData[propertyLaneName][property.type]['route'].push({
                                origin :propertyOrigin,
                                destination :propertyDestination,
                                type :propertyType,
                                emissions : propertyEmissions,
                                fuel_type : propertyFuelType,
                            });
                        }
                    } else {
                        if(property.recommended_type == 'original') {
                            laneData[propertyLaneName][property.type]['original_emission'] += propertyEmissions;
                        } else {
                            laneData[propertyLaneName][property.type]['customize_emission'] += propertyEmissions;
                            laneData[propertyLaneName][property.type]['route'].push({
                                origin :propertyOrigin,
                                destination :propertyDestination,
                                type :propertyType,
                                emissions : propertyEmissions,
                                fuel_type : propertyFuelType,
                            });
                        }
                    }
                } else {
                    let original_emission = 0;
                    let customize_emission = 0;
                    laneData[propertyLaneName] ={};
                    let route = []
                 //   laneData[property.lane_name][property.type] ={};
                    let laneEmissionData = await req.db.Emission.findOne({
                        attributes: ['id', [ sequelize.literal('( SELECT SUM(AES_DECRYPT(UNHEX(emission),"'+SQLToken+'")) DIV SUM(AES_DECRYPT(UNHEX(total_ton_miles),"'+SQLToken+'")) )'),'intensity'],
                        [ sequelize.literal('( SELECT SUM(AES_DECRYPT(UNHEX(shipments),"'+SQLToken+'")) )'),'shipments']],
                        where: {'name':property.lane_name,date: {
                            [Op.between]: [pastData, currentData],
                        }},
                        raw:true
                    }); 
                    if(property.type == 'alternative_fuel') {
                        if(property.recommended_type == 'original') {
                            original_emission = propertyEmissions;
                        } else {
                            route.push({
                                origin :AES.decrypt(property.origin, SQLToken),
                                destination : AES.decrypt(property.destination, SQLToken),
                            })
                            customize_emission = propertyEmissions;
                        } 
                        
                        laneData[propertyLaneName][property.type] = {
                            name : propertyLaneName,
                            origin : propertyOrigin,
                            destination : propertyDestination,
                            original_emission : original_emission,
                            customize_emission : customize_emission,
                            route : route,
                            shipments : laneEmissionData.shipments,
                            intensity : laneEmissionData.intensity,
                            type : propertyType,
                            decarb_id : property.decarb_id
                        }
                    } else {
                        if(property.recommended_type == 'original') {
                            original_emission = propertyEmissions;
                        } else {
                            customize_emission = propertyEmissions;
                            route.push({
                                origin :propertyOrigin,
                                destination : propertyDestination
                            })
                        } 
                        laneData[propertyLaneName][property.type] = {
                            name : propertyLaneName,
                            origin : propertyOrigin,
                            destination : propertyDestination,
                            original_emission : original_emission,
                            customize_emission : customize_emission,
                            route : route,
                            shipments : laneEmissionData.shipments,
                            intensity : laneEmissionData.intensity,
                            type : propertyType,
                            decarb_id : property.decarb_id
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
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Project =require("../models").Project;
const User =require("../models").Users;
const Response=require("../helper/api-response");
const Emission =require("../models").Emission;
const Helper=require("../helper/common-helper");

exports.getRecommendedLevers=async(req,res) => {
    try {
            //console.log(type,email,password);return 
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
                vendor : 0,
                tonnage : 0
            }
            return Response.customSuccessResponseWithData(res,'Recommended levers data.',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}
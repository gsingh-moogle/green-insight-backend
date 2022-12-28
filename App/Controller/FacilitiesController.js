const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const Response=require("../helper/api-response");


exports.getFacilitiesTableData=async(req,res) => {
    try {
        let {region_id, year}=req.body;
        const where = {emission_type:'facilities'}
        if (region_id || year) {
            where[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                )
            }
        }
        //console.log(type,email,password);return 
        let getRegionTableData = await Emission.findAll({
            attributes: ['id', 'gap_to_target', 'intensity','cost','service'],
            where:where, include: [
                {
                    model: Facility,
                    attributes: ['name'],
                    include: [
                    {
                        model: User,
                        attributes: ['name']
                    }]
                }],
                limit : 10,
            });
        //check password is matched or not then exec
        if(getRegionTableData){
            return Response.customSuccessResponseWithData(res,'Get Facilities Table Data',getRegionTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getFacilitiesEmissionData=async(req,res) => {
    try {
        let {region_id, year}=req.body;
        const where = {emission_type:'facilities'}
        if (region_id || year) {
            where[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                )
            }
        }
            //console.log(type,email,password);return 
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity']],
                where:where, include: [
                    {
                        model: Facility,
                        attributes: ['name']
                    }],
                    group: ['facilities_id'],
                    limit : 10,
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                const data = getRegionEmissions.map((item) => [item["Facility.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Facilities Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

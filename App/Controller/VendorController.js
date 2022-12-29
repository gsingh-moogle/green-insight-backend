const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const Vendor =require("../models").Vendor;
const Response=require("../helper/api-response");


exports.getVendorTableData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {emission_type:'vendor'}
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

            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter)
                )
            }
        }
        //console.log(type,email,password);return 
        let getFacilitiesTableData = await Emission.findAll({
            attributes: ['id', 'gap_to_target', 'intensity','cost','service',['truck_load','emission_reduction_target'],['inter_modal','annual_shipment']],
            where:where, include: [
                {
                    model: Vendor,
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
        if(getFacilitiesTableData){
            for (const property of getFacilitiesTableData) {
                property['intensity'] = (property.intensity <= 500)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 500 && property.intensity >= 700)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5000)?{value:property.cost,color:'#D88D49'}:(property.cost > 5000 && property.cost >= 7000)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 500)?{value:property.service,color:'#D88D49'}:(property.service > 500 && property.service >= 700)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Vendor Table Data',getFacilitiesTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getVendorEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {emission_type:'vendor'}
        if (region_id || year || quarter) {
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
            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter)
                )
            }
        }
            //console.log(type,email,password);return 
            let getFacilitiesEmissionData = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity'],
                [ sequelize.literal('( SELECT SUM(gap_to_target) )'),'gap_to_target'],
                [ sequelize.literal('( SELECT SUM(service) )'),'service']],
                where:where, include: [
                    {
                        model: Vendor,
                        attributes: ['name']
                    }],
                    group: ['vendor_id'],
                    limit : 10,
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getFacilitiesEmissionData){
                const data = getFacilitiesEmissionData.map((item) => [item["Vendor.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Vendor Emissions',getFacilitiesEmissionData,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Lane =require("../models").Lane;
const Vendor =require("../models").Vendor;
const Response=require("../helper/api-response");


exports.getLaneTableDataHighIntensity=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {intensity: {[Op.gte]: 500}};
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
        let getLaneTableData = await Lane.findAll({
            attributes: ['name','vendor_id'], 
            //include: [
                // {
                //     model: Emission,
                //     attributes: ['cost',['gap_to_target','share_of_tonnage'],['createdAt','contract']],
                //     where: {intensity: {
                //         [Op.gt]: [500]
                //       }}
                // }],
              //  group: ['lane_id'],
                raw: true,
                limit: 10
            });
            console.log('getLaneTableData',getLaneTableData);
        //check getVendorTableData is matched or not then exec
        if(getLaneTableData){
            let data = []
            for (const property of getLaneTableData) {
                let data = await Emission.findAll({
                    where:{'vendor_id':property.vendor_id},
                    attributes: ['cost','intensity',['gap_to_target','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`Emission.createdAt`), '%M %Y'), 'contract']], 
                    include: [
                        {
                            model: Vendor,
                            attributes: ['name'],
                        }],
                        raw: true,
                        limit:3
                    });
                property.VendorEmission = data;
            //     property['intensity'] = (property.intensity <= 500)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 500 && property.intensity >= 700)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
            //     property['cost'] = (property.cost <= 5000)?{value:property.cost,color:'#D88D49'}:(property.cost > 5000 && property.cost >= 7000)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
            //     property['service'] = (property.service <= 500)?{value:property.service,color:'#D88D49'}:(property.service > 500 && property.service >= 700)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Lane Table Data',getLaneTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getLaneTableDataLowIntensity=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {intensity: {[Op.lt]: 500}};
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
        let getLaneTableData = await Lane.findAll({
            attributes: ['name','vendor_id'], 
            //include: [
                // {
                //     model: Emission,
                //     attributes: ['cost',['gap_to_target','share_of_tonnage'],['createdAt','contract']],
                //     where: {intensity: {
                //         [Op.gt]: [500]
                //       }}
                // }],
              //  group: ['lane_id'],
                raw: true,
                limit: 10
            });
            console.log('getLaneTableData',getLaneTableData);
        //check getVendorTableData is matched or not then exec
        if(getLaneTableData){
            let data = []
            for (const property of getLaneTableData) {
                let data = await Emission.findAll({
                    where:{'vendor_id':property.vendor_id},
                    attributes: ['cost','intensity',['gap_to_target','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`Emission.createdAt`), '%M %Y'), 'contract']], 
                    include: [
                        {
                            model: Vendor,
                            attributes: ['name'],
                        }],
                        raw: true,
                        limit:3
                    });
                property.VendorEmission = data;
            //     property['intensity'] = (property.intensity <= 500)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 500 && property.intensity >= 700)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
            //     property['cost'] = (property.cost <= 5000)?{value:property.cost,color:'#D88D49'}:(property.cost > 5000 && property.cost >= 7000)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
            //     property['service'] = (property.service <= 500)?{value:property.service,color:'#D88D49'}:(property.service > 500 && property.service >= 700)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Lane Table Data',getLaneTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getLaneEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {emission_type:'lane'}
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
            let getLaneEmissionData = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity']],
                where:where, include: [
                    {
                        model: Lane,
                        attributes: ['name']
                    }],
                    group: ['lane_id'],
                    limit : 10,
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getLaneEmissionData){
                const data = getLaneEmissionData.map((item) => [item["Lane.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Lane Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

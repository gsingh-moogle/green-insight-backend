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
            attributes: ['name','vendor_id','id'], 
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
                    where:{'lane_id':property.id,intensity: {[Op.gte]: 12}},
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
                for (const dataValue of property.VendorEmission) {
                    dataValue['intensity'] = (dataValue.intensity <= 12)?{value:dataValue.intensity,color:'#d8856b'}:(dataValue.intensity > 12 && dataValue.intensity >= 17)?{value:dataValue.intensity,color:'#EFEDE9'}:{value:dataValue.intensity,color:'#215254'};
                    dataValue['cost'] = (dataValue.cost <= 5)?{value:dataValue.cost,color:'#d8856b'}:(dataValue.cost > 5 && property.cost >= 7)?{value:dataValue.cost,color:'#EFEDE9'}:{value:dataValue.cost,color:'#215254'};
                }
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
                    where:{'vendor_id':property.vendor_id,intensity: {[Op.lt]: 12}},
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
                    for (const dataValue of property.VendorEmission) {
                        dataValue['intensity'] = (dataValue.intensity <= 12)?{value:dataValue.intensity,color:'#d8856b'}:(dataValue.intensity > 12 && dataValue.intensity >= 17)?{value:dataValue.intensity,color:'#EFEDE9'}:{value:dataValue.intensity,color:'#215254'};
                    dataValue['cost'] = (dataValue.cost <= 5)?{value:dataValue.cost,color:'#d8856b'}:(dataValue.cost > 5 && property.cost >= 7)?{value:dataValue.cost,color:'#EFEDE9'}:{value:dataValue.cost,color:'#215254'};
                    }
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
                attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[ sequelize.literal('( SELECT SUM(detractor) )'),'detractor']],
                where:where, include: [
                    {
                        model: Lane,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    limit : 10,
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getLaneEmissionData){

                let count = 0;
                let contributor = [];
                let detractor = [];
                for (const property of getLaneEmissionData) {
                    if(count < (getLaneEmissionData.length/2)){
                        contributor.push({
                            name:property["Lane.name"],
                            value:property.contributor,
                            color:'#215154'
                        })
                    } else {
                        detractor.push({
                            name:property["Lane.name"],
                            value:property.detractor,
                            color:'#d8856b'
                        })
                    } 
                    count++;
                }
                const data = {
                    contributor:contributor,
                    detractor:detractor
                };
               // const data = getLaneEmissionData.map((item) => [item["Lane.name"],item.contributor]);
                return Response.customSuccessResponseWithData(res,'Lane Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

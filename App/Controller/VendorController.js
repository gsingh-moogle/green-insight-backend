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
        let getVendorTableData = await Emission.findAll({
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
        //check getVendorTableData is matched or not then exec
        if(getVendorTableData){
            for (const property of getVendorTableData) {
                property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 12 && property.intensity >= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5)?{value:property.cost,color:'#D88D49'}:(property.cost > 5 && property.cost >= 7)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 15)?{value:property.service,color:'#D88D49'}:(property.service > 15 && property.service >= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Vendor Table Data',getVendorTableData,200)
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
            let getVendorEmissionData = await Emission.findAll({
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
            if(getVendorEmissionData){
                let data = [];
           //     const colors = ['#D88D49','#EFEDE9','#215154','#5F9A80','#D88D49','#215154','#FFCB77','#215254','#215154','#215254'];
                const colors = ['#d8856b','#d8856b','#d8856b','#d8856b','#dcdcdc','#dcdcdc','#215154','#215154','#215154','#215154'];
                let i =0;
                for (const property of getVendorEmissionData) {
                    data.push({
                        x:property.intensity,
                        y:property.service,
                        z:property.gap_to_target,
                        name:property['Vendor.name'],
                        color: colors[i]
                    })
                    i++;
                }
               // const data = getFacilitiesEmissionData.map((item) => [item["Vendor.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Vendor Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

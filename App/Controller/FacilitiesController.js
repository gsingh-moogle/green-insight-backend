const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const Response=require("../helper/api-response");


exports.getFacilitiesTableData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
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

            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter)
                )
            }
        }
        //console.log(type,email,password);return 
        let getFacilitiesTableData = await Emission.findAll({
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
        if(getFacilitiesTableData){
            for (const property of getFacilitiesTableData) {
                property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 12 && property.intensity >= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5)?{value:property.cost,color:'#D88D49'}:(property.cost > 5 && property.cost >= 7)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 15)?{value:property.service,color:'#D88D49'}:(property.service > 15 && property.service >= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Facilities Table Data',getFacilitiesTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getFacilitiesEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {emission_type:'facilities'}
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
            attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[ sequelize.literal('( SELECT SUM(detractor) )'),'detractor']],
            where:where, include: [
                {
                    model: Facility,
                    attributes: ['name']
                }],
                group: ['facilities_id'],
                limit : 10,
                raw: true
            });
            console.log('getFacilitiesEmissionData',getFacilitiesEmissionData);
        //check password is matched or not then exec
        if(getFacilitiesEmissionData){
            let count = 0;
            let contributor = [];
            let detractor = [];
            for (const property of getFacilitiesEmissionData) {
                if(count < (getFacilitiesEmissionData.length/2)){
                    contributor.push({
                        name:property["Facility.name"],
                        value:property.contributor,
                        color:'#215154'
                    })
                } else {
                    detractor.push({
                        name:property["Facility.name"],
                        value:property.detractor,
                        color:'#d88d49'
                    })
                } 
                count++;
            }
            const data = {
                contributor:contributor,
                detractor:detractor
            };
            return Response.customSuccessResponseWithData(res,'Facilities Emissions',data,200);
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

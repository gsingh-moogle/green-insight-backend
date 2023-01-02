const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const VendorEmissionStatic =require("../models").VendorEmissionStatic;
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
                property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#d8856b'}:(property.intensity > 12 && property.intensity <= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5)?{value:property.cost,color:'#d8856b'}:(property.cost > 5 && property.cost <= 7)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 15)?{value:property.service,color:'#d8856b'}:(property.service > 15 && property.service <= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
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
       // const where = {emission_type:'facilities'}
       const where = {}
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

        //New Code
        let getFacilitiesEmissionData = await VendorEmissionStatic.findAll({
            attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor']],
            where:where, include: [
                {
                    model: Facility,
                    attributes: ['name']
                }],
                group: ['vendor_id'],
                limit : 8,
                order:[['contributor','desc']],
                raw: true
            });
            console.log('getFacilitiesEmissionData',getFacilitiesEmissionData);
        //check password is matched or not then exec
        if(getFacilitiesEmissionData){
            let contributor = [];
            let detractor = [];
            let count = 0;
            for (const property of getFacilitiesEmissionData) {
                if(parseInt(property.contributor)> 48){
                    contributor.push({
                        name:property["Facility.name"],
                        value:parseInt(property.contributor),
                        color:'#d8856b'
                    })
                } else if(parseInt(property.contributor) <= 48 && parseInt(property.contributor) >= 43){
                    if(count == 0) {
                        contributor.push({
                            name:property["Facility.name"],
                            value:parseInt(property.contributor),
                            color:'#efede9'
                        });
                        
                    } else if (count == 1) {
                        detractor.push({
                            name:property["Facility.name"],
                            value:parseInt(property.contributor),
                            color:'#efede9'
                        })
                    }
                    count++;
                } else {
                    detractor.push({
                        name:property["Facility.name"],
                        value:parseInt(property.contributor),
                        color:'#215154'
                    })
                } 
            }
            const data = {
                contributor:contributor,
                detractor:detractor
            };
          //  const data = getFacilitiesEmissionData.map((item) => [item["Facility.name"],item.contributor]);
            return Response.customSuccessResponseWithData(res,'Facilities Emissions',data,200);
        } else { return Response.errorRespose(res,'No Record Found!');}

        // //OLD CODE
        // let getFacilitiesEmissionData = await Emission.findAll({
        //     attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[ sequelize.literal('( SELECT SUM(detractor) )'),'detractor']],
        //     where:where, include: [
        //         {
        //             model: Facility,
        //             attributes: ['name']
        //         }],
        //         group: ['facilities_id'],
        //         limit : 6,
        //         order:['contributor'],
        //         raw: true
        //     });
        //     console.log('getFacilitiesEmissionData',getFacilitiesEmissionData);
        // //check password is matched or not then exec
        // if(getFacilitiesEmissionData){
        //     let count = 0;
        //     let contributor = [];
        //     let detractor = [];
        //     for (const property of getFacilitiesEmissionData) {
        //         if(count < (getFacilitiesEmissionData.length/2)){
        //             contributor.push({
        //                 name:property["Facility.name"],
        //                 value:property.contributor,
        //                 color:'#d8856b'
        //             })
        //         } else {
        //             detractor.push({
        //                 name:property["Facility.name"],
        //                 value:property.contributor,
        //                 color:'#215154'
        //             })
        //         } 
        //         count++;
        //     }
        //     const data = {
        //         contributor:contributor,
        //         detractor:detractor
        //     };
        //   //  const data = getFacilitiesEmissionData.map((item) => [item["Facility.name"],item.contributor]);
        //     return Response.customSuccessResponseWithData(res,'Facilities Emissions',data,200);
        // } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

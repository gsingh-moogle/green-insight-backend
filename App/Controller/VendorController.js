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
                property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#d8856b'}:(property.intensity > 12 && property.intensity <= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5)?{value:property.cost,color:'#d8856b'}:(property.cost > 5 && property.cost <= 7)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 15)?{value:property.service,color:'#d8856b'}:(property.service > 15 && property.service <= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
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
                if (region_id || year || quarter) {
                   
                    
            //     const colors = ['#D88D49','#EFEDE9','#215154','#5F9A80','#D88D49','#215154','#FFCB77','#215254','#215154','#215254'];
                    const colors = ['#d8856b','#d8856b','#d8856b','#d8856b','#dcdcdc','#dcdcdc','#215154','#215154','#215154','#215154'];
                    let i =0;
                    for (const property of getVendorEmissionData) {

                            data.push({
                                x:(property.intensity/10),
                                y:(property.service/10),
                                z:(property.gap_to_target/10),
                                name:property['Vendor.name'],
                                color: colors[i]
                            })
                    
                        
                        i++;
                    }
                } else {
                    data = [
                        { x: 42, y: 35, z: 28.5, name:"Ascend",color: '#d8856b'},
                        { x: 50, y: 45, z: 28.5, name:"Marten Transport",color: '#dcdcdc'},
                        { x: 55, y: 55, z: 22.5, name:"Cowan Systems",color: '#215154'},
                        { x: 65, y: 60, z: 22.5, name:"USA Truck",color: '#215154'},
                        { x: 70, y: 50, z: 22.5, name:"C.R England",color: '#215154'},
                        { x: 70, y: 70, z: 25.5, name:"Western Express",color: '#215154'},
                        { x: 60, y: 70, z: 35.5, name:"Dart Transport Co",color: '#215154'},
                        { x: 45, y: 45, z: 28.5, name:"Evan Delivery",color: '#dcdcdc'},
                        { x: 35, y: 35, z: 31.3, name: 'R&R Express',color: '#d8856b'}
                      ];
                }
               // const data = getFacilitiesEmissionData.map((item) => [item["Vendor.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Vendor Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

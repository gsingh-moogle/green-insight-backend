const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Lane =require("../models").Lane;
const Vendor =require("../models").Vendor;
const LaneEmissionStatic =require("../models").LaneEmissionStatic;
const VendorEmissionStatic =require("../models").VendorEmissionStatic;

const Response=require("../helper/api-response");


exports.getLaneTableDataHighIntensity=async(req,res) => {
    try {
        let {region_id, year, quarter, toggel_data}=req.body;
        const where = {};
        const regionWhere = {};
        if (region_id || year) {
            where[Op.and] = []
            regionWhere[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('Emission.date')), year)
                )
            }

            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('Emission.date')), quarter)
                )
            }
        }
        //console.log(type,email,password);return
        // let getLaneTableData = await Vendor.findAll({
        //     attributes: ['name','lane_id'],
        //     include: [
        //     {
        //         model: Lane,
        //         attributes:  ['name'],  
        //     },
        //     {
        //         model: Emission,
        //         where:where,
        //         attributes:  ['cost','intensity',['gap_to_target','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%M %Y'), 'contract']],  
        //         include:[
        //             {
        //                 model: Vendor,
        //                 attributes:  ['name'],  
        //             }
        //         ],
        //         limit:3
        //     }],
        //     limit:3
        // });

        // let getLaneTableData = await Vendor.findAll({
        //     attributes: ['name'],
        //     include: [
        //     {
        //         model: VendorEmissionStatic,
        //         where:where,
        //         attributes:  [['contributor','cost'],['contributor','intensity'],['contributor','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`VendorEmissionStatics.date`), '%M %Y'), 'contract']],
        //         include:[
        //             {
        //                 model: Lane,
        //                 attributes:  ['name'],  
        //             }
        //         ]
        //     }],
        // });

        let getLaneTableData = await Emission.findAll({
            attributes: ['region_id',['name','lane_name'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%M %Y'), 'contract'],[ sequelize.literal('( SELECT ROUND(SUM(emission) DIV SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission']],
            where:where,
            order:[['intensity','desc']],
            group: ['lane_name'],
            limit:10,
            raw:true
        });

        if(getLaneTableData){
            // let data = []
            let data = []
            let lane_id = [1,2,3,4,5,6,7,8];
            let count = 0;
            let convertToMillion  = 1000000;
            let total = [];
            for (const property of getLaneTableData) {
                let data = property.intensity;
                if(toggel_data == 1) {
                    data = parseFloat((property.emission/convertToMillion).toFixed(2));
                }
                total.push(data);
            }
            
            const average = total.reduce((a, b) => a + b, 0) / total.length;
            let showData = [];

            for (const property of getLaneTableData) {
                let emissionData = property.intensity;
                if(toggel_data == 1) {
                    emissionData = parseFloat((property.emission/convertToMillion).toFixed(2));
                }
                if(emissionData > average) {
                    property.Lane ={
                        name :property.lane_name,
                        color:'#d8856b'
                    };
                    showData.push(property);
                }
                

                // property['intensity'] = (property.intensity > average)?{value:property.intensity,color:'#d8856b'}:{value:property.intensity,color:'#215254'};
                // property['cost'] = (property.emission > average)?{value:property.emission,color:'#d8856b'}:{value:property.emission,color:'#215254'};

                // if(count < 3) {
                //     property.Lane.color = '#d8856b';
                //     data.push(property);
                // } else if(count == 4) {
                //     property.Lane.color = '#EFEDE9';
                //     data.push(property);
                // } else if (count == 5) {
                //     property.Lane.color = '#EFEDE9';
                //     data.push(property);
                // } else {
                //     property.Lane.color = '#215254';
                //     data.push(property);
                // }
              //  count++;
            }

            // for (const property of getLaneTableData) {                
            //     property.Lane ={
            //         name :property.lane_name
            //     };
            //     if(count < 3) {
            //         property.Lane.color = '#d8856b';
            //     } else if(count == 4) {
            //         property.Lane.color = '#EFEDE9';
            //     } else if (count == 5) {
            //         property.Lane.color = '#EFEDE9';
            //     } else {
            //         property.Lane.color = '#215254';
            //     }


            //     count++;
            // }
            return Response.customSuccessResponseWithData(res,'Get Lane Table Data',getLaneTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getLaneTableDataLowIntensity=async(req,res) => {
    try {
        let {region_id, year, quarter, toggel_data}=req.body;
        const where = {};
        const regionWhere = {};
        if (region_id || year) {
            where[Op.and] = []
            regionWhere[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
            if (year) {
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('Emission.date')), year)
                )
            }

            if (quarter) {
                where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('Emission.date')), quarter)
                )
            }
        }
        //console.log(type,email,password);return
        // let getLaneTableData = await Vendor.findAll({
        //     attributes: ['name','lane_id'],
        //     include: [
        //     {
        //         model: Lane,
        //         attributes:  ['name'],  
        //     },
        //     {
        //         model: Emission,
        //         where:where,
        //         attributes:  ['cost','intensity',['gap_to_target','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%M %Y'), 'contract']],  
        //         include:[
        //             {
        //                 model: Vendor,
        //                 attributes:  ['name'],  
        //             }
        //         ],
        //         limit:3
        //     }],
        //     limit:3
        // });

        // let getLaneTableData = await Vendor.findAll({
        //     attributes: ['name'],
        //     include: [
        //     {
        //         model: VendorEmissionStatic,
        //         where:where,
        //         attributes:  [['contributor','cost'],['contributor','intensity'],['contributor','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`VendorEmissionStatics.date`), '%M %Y'), 'contract']],
        //         include:[
        //             {
        //                 model: Lane,
        //                 attributes:  ['name'],  
        //             }
        //         ]
        //     }],
        // });

        let getLaneTableData = await Emission.findAll({
            attributes: ['region_id',['name','lane_name'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%M %Y'), 'contract'],[ sequelize.literal('( SELECT ROUND(SUM(emission) DIV SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission']],
            where:where,
            order:[['intensity','desc']],
            group: ['lane_name'],
            limit:10,
            raw:true
        });
        if(getLaneTableData){
            // let data = []
            let data = []
            let lane_id = [1,2,3,4,5,6,7,8];
            let count = 0;
            let convertToMillion  = 1000000;
            let total = [];
            for (const property of getLaneTableData) {
                let data = property.intensity;
                if(toggel_data == 1) {
                    data = parseFloat((property.emission/convertToMillion).toFixed(2));
                }
                total.push(data);
            }
            
            const average = total.reduce((a, b) => a + b, 0) / total.length;
            let showData = [];
            for (const property of getLaneTableData) {
                let emissionData = property.intensity;
                if(toggel_data == 1) {
                    emissionData = parseFloat((property.emission/convertToMillion).toFixed(2));
                }
                if(emissionData < average) {
                    property.Lane ={
                        name :property.lane_name,
                        color:'#215254'
                    };
                    showData.push(property);
                }
                

                // property['intensity'] = (property.intensity > average)?{value:property.intensity,color:'#d8856b'}:{value:property.intensity,color:'#215254'};
                // property['cost'] = (property.emission > average)?{value:property.emission,color:'#d8856b'}:{value:property.emission,color:'#215254'};

                // if(count < 3) {
                //     property.Lane.color = '#d8856b';
                //     data.push(property);
                // } else if(count == 4) {
                //     property.Lane.color = '#EFEDE9';
                //     data.push(property);
                // } else if (count == 5) {
                //     property.Lane.color = '#EFEDE9';
                //     data.push(property);
                // } else {
                //     property.Lane.color = '#215254';
                //     data.push(property);
                // }
              //  count++;
            }
            return Response.customSuccessResponseWithData(res,'Get Lane Table Data',showData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

// exports.getLaneTableDataLowIntensity=async(req,res) => {
//     try {
//         let {region_id, year, quarter}=req.body;
//         const where = {intensity: {[Op.lt]: 12}};
//         if (region_id || year) {
//             where[Op.and] = []
//             if (region_id) {
//                 where[Op.and].push({
//                     region_id: region_id
//                 })
//             }
//             if (year) {
//                 where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
//                 )
//             }

//             if (quarter) {
//                 where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter)
//                 )
//             }
//         }
//         //console.log(type,email,password);return 
//         let getLaneTableData = await Vendor.findAll({
//             where:{id: {[Op.gt]: 3}},
//             attributes: ['name','lane_id'],
//             include: [
//             {
//                 model: Lane,
//                 attributes:  ['name'],  
//             },
//             {
//                 model: Emission,
//                 where:where,
//                 attributes:  ['cost','intensity',['gap_to_target','share_of_tonnage'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%M %Y'), 'contract']],  
//                 include:[
//                     {
//                         model: Vendor,
//                         attributes:  ['name'],  
//                     }
//                 ],
//                 limit:3
//             }],
//             limit:5
//         });
//         //check getVendorTableData is matched or not then exec
//         if(getLaneTableData){
            
//             let count = 0;
//             for (const property of getLaneTableData) {
//                 //  console.log('property',property.Lane.name);
//                 if(count < 2) {
//                     property.Lane.dataValues['color']= '#EFEDE9';
//                 } else {
//                     property.Lane.dataValues['color']= '#215254';
//                 }
//                 for (const dataValue of property.Emissions) {
//                     dataValue['intensity'] = (dataValue.intensity <= 12)?{value:dataValue.intensity,color:'#d8856b'}:(dataValue.intensity > 12 && dataValue.intensity <= 17)?{value:dataValue.intensity,color:'#EFEDE9'}:{value:dataValue.intensity,color:'#215254'};
//                     dataValue['cost'] = (dataValue.cost <= 5)?{value:dataValue.cost,color:'#d8856b'}:(dataValue.cost > 5 && property.cost <= 7)?{value:dataValue.cost,color:'#EFEDE9'}:{value:dataValue.cost,color:'#215254'};
//                 }
//                 count++;
//             }
            
//             return Response.customSuccessResponseWithData(res,'Get Lane Table Data',getLaneTableData,200)
//         } else { return Response.errorRespose(res,'No Record Found!');}
//     } catch (error) {
//         console.log('____________________________________________________________error',error);
//     }
// }

exports.getLaneEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter, toggel_data}=req.body;
      //  const where = {emission_type:'lane'}
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

            //NEW CODE
            let getLaneEmissionData = await Emission.findAll({
                attributes: ['id',['name','lane_name'],[ sequelize.literal('( SELECT ROUND(SUM(emission) DIV SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission']],
                where:where,
                group: [`lane_name`],
                order:[['intensity','desc']],
                limit: 10,
                raw: true
            });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getLaneEmissionData){
                let convertToMillion  = 1000000;
                let count = 0;
                let contributor = [];
                let detractor = [];
                let unit = 'g';
                let total = [];
                if(toggel_data == 1) {
                    unit = 'tCo2e';
                }
                //NEW CODE
                for (const property of getLaneEmissionData) {
                    let data = property.intensity;
                    if(toggel_data == 1) {
                        data = parseFloat((property.emission/convertToMillion).toFixed(2));
                    }
                    
                    total.push(data);
                }
                
                const average = total.reduce((a, b) => a + b, 0) / total.length;
                let avgData = [];
                console.log('getLaneEmissionData',getLaneEmissionData);
                for (const property of getLaneEmissionData) {
                    let data = property.intensity-average;
                    let compareValue = property.intensity;
                    if(toggel_data == 1) {
                        compareValue = property.emission/convertToMillion;
                        data = parseFloat(((property.emission/convertToMillion)-average).toFixed(2));
                    }
                    if( compareValue > average) {
                        contributor.push({
                            name:property["lane_name"],
                            value:parseFloat(Math.abs(data).toFixed(2)),
                            color:'#d8856b'
                        })
                    } else {
                        detractor.push({
                            name:property["lane_name"],
                            value:parseFloat(Math.abs(data).toFixed(2)),
                            color:'#215154'
                        })
                    }
                    // avgData.push({
                    //     name :property["lane_name"],
                    //     value: data.toFixed(2)
                    // });
                }

                contributorLenght = contributor.length;
                if(contributorLenght > 0){
                    contributor[contributorLenght-1]['color'] ='#efede9';
                }
                detractor = detractor.reverse()
                detractorLenght = detractor.length;
                if(detractorLenght > 0){
                    detractor[0]['color'] ='#efede9';
                }

                // console.log('avgData',avgData);
                // let c = 0;
                // for (const property of avgData) {
                //     if(c < 2) {
                //         contributor.push({
                //             name:property["name"],
                //             value:Math.abs(property["value"]),
                //             color:'#d8856b'
                //         })
                //     } else if(c == 2) {
                //         contributor.push({
                //             name:property["name"],
                //             value:Math.abs(property["value"]),
                //             color:'#efede9'
                //         });
                //     } else if(c == 5){
                //         detractor.push({
                //             name:property["name"],
                //             value:Math.abs(property["value"]),
                //             color:'#efede9'
                //         })
                //     } else {
                //         detractor.push({
                //             name:property["name"],
                //             value:Math.abs(property["value"]),
                //             color:'#215154'
                //         })
                //     }
                //     c++;
                // }
                 //NEW CODE
                //  for (const property of getLaneEmissionData) {
                //     if(count < 3){
                //         contributor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#d8856b'
                //         })
                //     } else if(count == 3){
                //         contributor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#efede9'
                //         });
                //   //  } else if(count == 4 && count <= 6){
                //     } else if(count == 4){
                //         detractor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#efede9'
                //         })
                //     } else {
                //         detractor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#215154'
                //         })
                //     }
                //     count++; 
                // }

                // for (const property of detractor) {

                // }

                //OLD CODE
                // for (const property of getLaneEmissionData) {
                //     // if(count < (getLaneEmissionData.length/2)){
                //     //     contributor.push({
                //     //         name:property["Lane.name"],
                //     //         value:property.contributor,
                //     //         color:'#d8856b'
                //     //     })
                //     // } else {
                //     //     detractor.push({
                //     //         name:property["Lane.name"],
                //     //         value:property.detractor,
                //     //         color:'#215154'
                //     //     })
                //     // } 
                //     // count++;

                //     if(parseInt(property.contributor)> 34){
                //         contributor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#d8856b'
                //         })
                //     } else if(parseInt(property.contributor) <= 34 && parseInt(property.contributor) >= 33){
                //         if(count == 0) {
                //             contributor.push({
                //                 name:property["Lane.name"],
                //                 value:parseInt(property.contributor),
                //                 color:'#efede9'
                //             });
                            
                //         } else if (count == 1) {
                //             detractor.push({
                //                 name:property["Lane.name"],
                //                 value:parseInt(property.contributor),
                //                 color:'#efede9'
                //             })
                //         }
                //         count++;
                //     } else {
                //         detractor.push({
                //             name:property["Lane.name"],
                //             value:parseInt(property.contributor),
                //             color:'#215154'
                //         })
                //     } 
                    
                // }
                const data = {
                    contributor:contributor,
                    detractor:detractor,
                    unit :unit
                };
               // const data = getLaneEmissionData.map((item) => [item["Lane.name"],item.contributor]);
                return Response.customSuccessResponseWithData(res,'Lane Emissions',data,200);
            } else { return Response.errorRespose(res,'No Record Found!');}

            //OLD CODE
            // let getLaneEmissionData = await Emission.findAll({
            //     attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[ sequelize.literal('( SELECT SUM(detractor) )'),'detractor']],
            //     where:where, include: [
            //         {
            //             model: Lane,
            //             attributes: ['name']
            //         }],
            //         group: [`lane_id`],
            //         limit : 6,
            //         raw: true
            //     });
            //   //  console.log('getRegionEmissions',getRegionEmissions);
            // //check password is matched or not then exec
            // if(getLaneEmissionData){

            //     let count = 0;
            //     let contributor = [];
            //     let detractor = [];
            //     for (const property of getLaneEmissionData) {
            //         if(count < (getLaneEmissionData.length/2)){
            //             contributor.push({
            //                 name:property["Lane.name"],
            //                 value:property.contributor,
            //                 color:'#d8856b'
            //             })
            //         } else {
            //             detractor.push({
            //                 name:property["Lane.name"],
            //                 value:property.detractor,
            //                 color:'#215154'
            //             })
            //         } 
            //         count++;
            //     }
            //     const data = {
            //         contributor:contributor,
            //         detractor:detractor
            //     };
            //    // const data = getLaneEmissionData.map((item) => [item["Lane.name"],item.contributor]);
            //     return Response.customSuccessResponseWithData(res,'Lane Emissions',data,200);
            // } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

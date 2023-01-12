const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const RegionByStatic =require("../models").RegionByStatic;
const Facility =require("../models").Facility;
const Vendor =require("../models").Vendor;
const Lane =require("../models").Lane;
const Company =require("../models").Company;
const CompanyData =require("../models").CompanyData;
const EmissionReduction =require("../models").EmissionReduction;
const EmissionIntensity =require("../models").EmissionIntensity;
const EmissionRegionStatic =require("../models").EmissionRegionStatic;
const RegionEmissionStatic =require("../models").RegionEmissionStatic;
const Response=require("../helper/api-response");


exports.getRegions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Region.findAll({where:{
            [Op.or]: [{id: 1}, {id: 2}]
          }});
        let getCompanies = await Company.findOne({where:{'id':1}});
        //check password is matched or not then exec
        if(getRegionEmissions){
            let data = {
                regions: getRegionEmissions,
                companies: getCompanies
            }
            return Response.customSuccessResponseWithData(res,'Region & Company Data',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionEmissions=async(req,res) => {
    try {
            let {region_id, company_id}=req.body;
            const where = {emission_type:'region'}
            if (region_id || company_id) {
                where[Op.and] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (company_id) {
                    where[Op.and].push({
                        company_id: company_id
                    })
                }
            }
            //console.log(type,email,password);return 
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id','contributor','detractor'],
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                let label = [];
                for (let i = 0; i < getRegionEmissions.length; i++) {
                    label.push(getRegionEmissions[i]);
                }
                let contributor = getRegionEmissions.map(a => a.contributor);
                let detractor = getRegionEmissions.map(a => a.detractor);
                let min = Math.min(...contributor);
                let max = Math.max(...detractor);
                let data ={
                    title : 'Region Emmision',
                    type : 'Horizontal Bar Chart',
                    min:min,
                    max:max,
                    dataset:[
                        {
                          label: 'Contributor',
                          data: contributor,
                          borderColor: '#5888d6',
                          backgroundColor: '#f7faf9',
                        },
                        {
                          label: 'Detractor',
                          data: detractor,
                          borderColor: '#2fa18c',
                          backgroundColor: '#f7faf9',
                        }
                      ]
                    
                }
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.getRegionIntensity=async(req,res) => {
    try {
            let {region_id, company_id, year}=req.body;
            const where = {emission_type:'region'}
            if (region_id || company_id || year) {
                where[Op.and] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (company_id) {
                    where[Op.and].push({
                        company_id: company_id
                    })
                }
                if (year) {
                    where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                    )
                }
            } else {
                where[Op.and] = []
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), new Date().getFullYear())
                    )
            }
            
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id','truck_load','inter_modal'],
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                let label = [];
                for (let i = 0; i < getRegionEmissions.length; i++) {
                    label.push(getRegionEmissions[i]);
                }
                let contributor = getRegionEmissions.map(a => a.truck_load);
                let detractor = getRegionEmissions.map(a => a.inter_modal);
                let min = Math.min(...contributor);
                let max = Math.max(...detractor);
                let data ={
                    title : 'Region Intensity Graph',
                    type : 'Horizontal Bar Chart',
                    min:min,
                    max:max,
                    dataset:[
                        {
                          label: 'TruckLoad',
                          data: contributor,
                          borderColor: '#5888d6',
                          backgroundColor: '#f7faf9',
                        },
                        {
                          label: 'InterModal',
                          data: detractor,
                          borderColor: '#2fa18c',
                          backgroundColor: '#f7faf9',
                        }
                      ]
                    
                }
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionEmissionsMonthly=async(req,res) => {
    try {
            //console.log(type,email,password);return 
            let {region_id, company_id, year}=req.body;
            //const where = {emission_type:'region'}
            const where = {}
            if (region_id || company_id || year) {
                where[Op.and] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (company_id) {
                    where[Op.and].push({
                        company_id: company_id
                    })
                }
                if (year) {
                    where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                    )
                }
            }

            //New Code Start
            let getRegionEmissions = await EmissionRegionStatic.findAll({
                attributes: ['id','intensity',
                [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
                'region_id'],
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                group: ['region_id',sequelize.fn('YEAR', sequelize.col('date'))],
                raw: true
            });

            let getCompanyData = await CompanyData.findOne({
                attributes: ['target_level','base_level'],
                where:{company_id:1},
                raw: true
            });
                console.log('getCompanyData',getCompanyData);
            if(getRegionEmissions){
                let dataObject = [];
                let minArray = [];
                let maxArray = [];
                let allDataArray = [];
                let maxCountArray = [];
                let targetLevel = [];
              //  const colors = ['#215154','#5F9A80','#D88D49','#C1D3C0','#367C90','#FFCB77','#215154','#5F9A80','#D88D49','#C1D3C0']
             //   const colors = ['#FFCB77','#367C90','#C1D3C0','#D88D49','#5F9A80','#215154','#FFCB77','#367C90','#C1D3C0','#D88D49']
              //  const colors = ['#215154','#5f9a80','#d8856b','#c1d3c0','#367c90','#ffcb77','#215154','#5f9a80','#d8856b','#c1d3c0']
                const colors = ['#ffcb77','#367c90','#c1d3c0','#d8856b','#5f9a80','#215154','#ffcb77','#367c90','#c1d3c0','#d8856b']
                const lables = [...new Set(getRegionEmissions.map(item => item.year))]
                const regions = [...new Set(getRegionEmissions.map(item => item['Region.name']))]
                console.log('labels', lables);
                console.log('regions', regions);
                console.log('getRegionEmissions', getRegionEmissions);
                for (let i = 0; i < regions.length; i++) {
                    let tempDataObject = {};
                    let tempArray = [];
                    for (const property of getRegionEmissions) {
                        if(property['Region.name'] == regions[i]) {
                            tempArray.push(parseInt(property.intensity));
                            if(tempDataObject["name"] === undefined){
                                tempDataObject.name = property['Region.name'];
                            }
                            if(tempDataObject["year"] === undefined){
                                tempDataObject.year = property.year;
                            }
                        }  
                    }
                    allDataArray.push(tempArray);
                //    maxCountArray.push(0);
                    tempDataObject.data = tempArray;
                    tempDataObject.color = colors[i];
                    dataObject.push(tempDataObject);
                }
              //  maxCountArray.push(0);
                
                for (let i = 0; i < allDataArray.length; i++) {

                   for (let j = 0; j < allDataArray[i].length; j++) {
                        if(maxCountArray[j] === undefined) {
                            maxCountArray[j] = allDataArray[i][j];
                        } else {
                            maxCountArray[j] += allDataArray[i][j];
                        }
                   }
                }

                for (let i = 0; i < maxCountArray.length; i++) {
                    targetLevel.push(maxCountArray[i]-(maxCountArray[i]*(20/100)));
                 }
                // for (var key in getCompanyData) {
                //     let tmpData = [];
                //     let tmpDataObject = {};
                //     for (let i = 0; i < lables.length; i++) {
                //         tmpData.push(getCompanyData[key])
                //         if(tmpDataObject.year === undefined){
                //             tmpDataObject.year = lables[i];
                //         }
                //     }
                //     tmpDataObject.name = key;
                //     tmpDataObject.data = tmpData;
                //     dataObject.push(tmpDataObject);
                // };

                let base = Math.max(...maxCountArray);
                let baseLine = base+(base*(15/100));
                    
                dataObject.push({
                    name:'company_level',
                    data:maxCountArray,
                });
                dataObject.push({
                    name:'target_level',
                    data:targetLevel,
                });
                dataObject.push({
                    name:'base_level',
                    data:baseLine,
                });
                return Response.customSuccessResponseWithData(res,'Region Emissions',dataObject,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
            //New Code End
            //OLD code Start
            // let getRegionEmissions = await Emission.findAll({
            //     attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity'],
            //     [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
            //     'region_id'],
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //     group: ['region_id',sequelize.fn('YEAR', sequelize.col('date'))],
            //     raw: true
            // });

            // let getCompanyData = await CompanyData.findOne({
            //     attributes: ['target_level','base_level'],
            //     where:{company_id:1},
            //     raw: true
            // });
            //     console.log('getCompanyData',getCompanyData);
            // if(getRegionEmissions){
            //     let dataObject = [];
            //     let minArray = [];
            //     let maxArray = [];
            //     let allDataArray = [];
            //     let maxCountArray = [];
            //     let targetLevel = [];
            //   //  const colors = ['#215154','#5F9A80','#D88D49','#C1D3C0','#367C90','#FFCB77','#215154','#5F9A80','#D88D49','#C1D3C0']
            //  //   const colors = ['#FFCB77','#367C90','#C1D3C0','#D88D49','#5F9A80','#215154','#FFCB77','#367C90','#C1D3C0','#D88D49']
            //   //  const colors = ['#215154','#5f9a80','#d8856b','#c1d3c0','#367c90','#ffcb77','#215154','#5f9a80','#d8856b','#c1d3c0']
            //     const colors = ['#ffcb77','#367c90','#c1d3c0','#d8856b','#5f9a80','#215154','#ffcb77','#367c90','#c1d3c0','#d8856b']
            //     const lables = [...new Set(getRegionEmissions.map(item => item.year))]
            //     const regions = [...new Set(getRegionEmissions.map(item => item['Region.name']))]
            //     console.log('labels', lables);
            //     console.log('regions', regions);
            //     console.log('getRegionEmissions', getRegionEmissions);
            //     for (let i = 0; i < regions.length; i++) {
            //         let tempDataObject = {};
            //         let tempArray = [];
            //         for (const property of getRegionEmissions) {
            //             if(property['Region.name'] == regions[i]) {
            //                 tempArray.push(property.intensity);
            //                 if(tempDataObject["name"] === undefined){
            //                     tempDataObject.name = property['Region.name'];
            //                 }
            //                 if(tempDataObject["year"] === undefined){
            //                     tempDataObject.year = property.year;
            //                 }
            //             }  
            //         }
            //         allDataArray.push(tempArray);
            //     //    maxCountArray.push(0);
            //         tempDataObject.data = tempArray;
            //         tempDataObject.color = colors[i];
            //         dataObject.push(tempDataObject);
            //     }
            //   //  maxCountArray.push(0);
                
            //     for (let i = 0; i < allDataArray.length; i++) {

            //        for (let j = 0; j < allDataArray[i].length; j++) {
            //             if(maxCountArray[j] === undefined) {
            //                 maxCountArray[j] = allDataArray[i][j];
            //             } else {
            //                 maxCountArray[j] += allDataArray[i][j];
            //             }
            //        }
            //     }

            //     for (let i = 0; i < maxCountArray.length; i++) {
            //         targetLevel.push(maxCountArray[i]-(maxCountArray[i]*(20/100)));
            //      }
            //     // for (var key in getCompanyData) {
            //     //     let tmpData = [];
            //     //     let tmpDataObject = {};
            //     //     for (let i = 0; i < lables.length; i++) {
            //     //         tmpData.push(getCompanyData[key])
            //     //         if(tmpDataObject.year === undefined){
            //     //             tmpDataObject.year = lables[i];
            //     //         }
            //     //     }
            //     //     tmpDataObject.name = key;
            //     //     tmpDataObject.data = tmpData;
            //     //     dataObject.push(tmpDataObject);
            //     // };

            //     let base = Math.max(...maxCountArray);
            //     let baseLine = base+(base*(15/100));
                    
            //     dataObject.push({
            //         name:'company_level',
            //         data:maxCountArray,
            //     });
            //     dataObject.push({
            //         name:'target_level',
            //         data:targetLevel,
            //     });
            //     dataObject.push({
            //         name:'base_level',
            //         data:baseLine,
            //     });
            //     return Response.customSuccessResponseWithData(res,'Region Emissions',dataObject,200)
            // } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}



exports.getFacilityEmissions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Emission.findAll({
            attributes: ['id', 'contributor', 'detractor'],
            where:{emission_type:'facilities'}, include: [
                {
                    model: Region,
                    attributes: ['name']
                }]
            });
        //check password is matched or not then exec
        if(getRegionEmissions){
            let contributor = getRegionEmissions.map(a => a.contributor);
            let detractor = getRegionEmissions.map(a => a.detractor);
            let min = Math.min(...contributor);
            let max = Math.max(...detractor);
            let data ={
                title : 'Facility Emmision',
                type : 'Horizontal Bar Chart',
                min:min,
                max:max,
                dataset:[
                    {
                      label: 'Contributor',
                      data: contributor,
                      borderColor: '#215154',
                      backgroundColor: '#f7faf9',
                    },
                    {
                      label: 'Detractor',
                      data: detractor,
                      borderColor: '#d8856b',
                      backgroundColor: '#f7faf9',
                    }
                  ]
                
            }
            return Response.customSuccessResponseWithData(res,'Facility Emissions',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getVendorEmissions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Emission.findAll({
            attributes: ['id', 'contributor', 'detractor'],
            where:{emission_type:'vendor'}, include: [
                {
                    model: Vendor,
                    attributes: ['name']
                }]
            });
        //check password is matched or not then exec
        if(getRegionEmissions){
            let contributor = getRegionEmissions.map(a => a.contributor);
            let detractor = getRegionEmissions.map(a => a.detractor);
            let min = Math.min(...contributor);
            let max = Math.max(...detractor);
            let data ={
                title : 'Vendor Emmision',
                type : 'Horizontal Bar Chart',
                min:min,
                max:max,
                dataset:[
                    {
                      label: 'Contributor',
                      data: contributor,
                      borderColor: '#5888d6',
                      backgroundColor: '#f7faf9',
                    },
                    {
                      label: 'Detractor',
                      data: detractor,
                      borderColor: '#2fa18c',
                      backgroundColor: '#f7faf9',
                    }
                  ]
                
            }
            return Response.customSuccessResponseWithData(res,'Vendor Emissions',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getLaneEmissions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Emission.findAll({
            attributes: ['id', 'contributor', 'detractor'],
            where:{emission_type:'lane'}, include: [
                {
                    model: Lane,
                    attributes: ['name']
                }]
            });
        //check password is matched or not then exec
        if(getRegionEmissions){
            let contributor = getRegionEmissions.map(a => a.contributor);
            let detractor = getRegionEmissions.map(a => a.detractor);
            let min = Math.min(...contributor);
            let max = Math.max(...detractor);
            let data ={
                title : 'Lane Emmision',
                type : 'Horizontal Bar Chart',
                min:min,
                max:max,
                dataset:[
                    {
                      label: 'Contributor',
                      data: contributor,
                      borderColor: '#5888d6',
                      backgroundColor: '#f7faf9',
                    },
                    {
                      label: 'Detractor',
                      data: detractor,
                      borderColor: '#2fa18c',
                      backgroundColor: '#f7faf9',
                    }
                  ]
                
            }
            return Response.customSuccessResponseWithData(res,'Lane Emissions',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionTableData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
        const where = {emission_type:'region'}
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
        let getRegionTableData = await Emission.findAll({
            
            
            attributes: ['id', 'gap_to_target', [ sequelize.literal('( SELECT SUM(intensity) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'cost'],'service',
            [ sequelize.literal('( extract(quarter from date) )'),'quarter']],
            where:where, include: [
                {
                    model: Region,
                    attributes: ['name'],
                    include: [
                    {
                        model: User,
                        attributes: ['name']
                    }]
                }],
                limit : 10,
                group: ['region_id'],
            });
        //check password is matched or not then exec
        if(getRegionTableData){
            for (const property of getRegionTableData) {
                property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#d8856b'}:(property.intensity > 12 && property.intensity <= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5)?{value:property.cost,color:'#d8856b'}:(property.cost > 5 && property.cost <= 7)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 15)?{value:property.service,color:'#d8856b'}:(property.service > 15 && property.service <= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            }
            return Response.customSuccessResponseWithData(res,'Get Region Table Data',getRegionTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter}=req.body;
      //  const where = {emission_type:'region'}
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
            //console.log(type,email,password);return 
            let getRegionEmissions = await RegionEmissionStatic.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor']],
                where:where, include: [
                    {
                        model: RegionByStatic,
                        attributes: ['region_name']
                    }],
                    group: ['region_by'],
                    limit : 8,
                    order:[['contributor','desc']],
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                let count = 0;
                let contributor = [];
                let detractor = [];
                //NEW CODE
                for (const property of getRegionEmissions) {
                    if(count < 3){
                        contributor.push({
                            name:property["RegionByStatic.region_name"],
                            value:parseInt(property.contributor),
                            color:'#d8856b'
                        })
                    } else if(count == 3){
                        contributor.push({
                            name:property["RegionByStatic.region_name"],
                            value:parseInt(property.contributor),
                            color:'#efede9'
                        });
                    } else if(count == 4){
                        detractor.push({
                            name:property["RegionByStatic.region_name"],
                            value:parseInt(property.contributor),
                            color:'#efede9'
                        })
                    } else {
                        detractor.push({
                            name:property["RegionByStatic.region_name"],
                            value:parseInt(property.contributor),
                            color:'#215154'
                        })
                    }
                    count++; 
                }

                //OLD CODE
                // for (const property of getRegionEmissions) {
                //     if(parseInt(property.contributor)> 47){
                //         contributor.push({
                //             name:property["RegionByStatic.region_name"],
                //             value:parseInt(property.contributor),
                //             color:'#d8856b'
                //         })
                //     } else if(parseInt(property.contributor) <= 47 && parseInt(property.contributor) >= 44){
                //         if(count == 0) {
                //             contributor.push({
                //                 name:property["RegionByStatic.region_name"],
                //                 value:parseInt(property.contributor),
                //                 color:'#efede9'
                //             });
                            
                //         } else if (count == 1) {
                //             detractor.push({
                //                 name:property["RegionByStatic.region_name"],
                //                 value:parseInt(property.contributor),
                //                 color:'#efede9'
                //             })
                //         }
                //         count++;
                //     } else {
                //         detractor.push({
                //             name:property["RegionByStatic.region_name"],
                //             value:parseInt(property.contributor),
                //             color:'#215154'
                //         })
                //     } 
                // }
            //     const data = {
            //         contributor:contributor,
            //         detractor:detractor
            //     };
            //     //const data = getRegionEmissions.map((item) => [item["Region.name"],item.contributor]);
            //     return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            // } else { return Response.errorRespose(res,'No Record Found!');}
            //OLD Code
            // //console.log(type,email,password);return 
            // let getRegionEmissions = await Emission.findAll({
            //     attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[ sequelize.literal('( SELECT SUM(detractor) )'),'detractor']],
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //         group: ['region_id'],
            //         limit : 10,
            //         raw: true
            //     });
            //   //  console.log('getRegionEmissions',getRegionEmissions);
            // //check password is matched or not then exec
            // if(getRegionEmissions){
            //     let count = 0;
            //     let contributor = [];
            //     let detractor = [];
            //     for (const property of getRegionEmissions) {
            //         if(count < (getRegionEmissions.length/2)){
            //             contributor.push({
            //                 name:property["Region.name"],
            //                 value:property.contributor,
            //                 color:'#d8856b'
            //             })
            //         } else {
            //             detractor.push({
            //                 name:property["Region.name"],
            //                 value:property.detractor,
            //                 color:'#215154'
            //             })
            //         } 
            //         count++;
            //     }
                const data = {
                    contributor:contributor,
                    detractor:detractor
                };
                //const data = getRegionEmissions.map((item) => [item["Region.name"],item.contributor]);
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
        
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionIntensityByYear=async(req,res) => {
    try {
            let {region_id, company_id, year, toggel, quarter}=req.body;
            let current_year = parseInt(new Date().getFullYear()-1);
            let past_year = new Date().getFullYear()-2;
           // const where = {emission_type:'region'}
            const where = {}
            if (region_id || company_id || year || quarter) {
                where[Op.and] = []
                where[Op.or] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (company_id) {
                    where[Op.and].push({
                        company_id: company_id
                    })
                }
                if (year) {
                    current_year = parseInt(year);
                    past_year = year-1;
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
                    
                } else {
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
                }

                // if (quarter) {
                //     if(quarter != 1) {
                //         where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter))
                //     } else {
                //         where[Op.or].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter-1))
                //         where[Op.or].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter))
                //     }
                    
                // }
            } else {
                    where[Op.and] = []
                    where[Op.or] = []
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
            }
            console.log('where',where);
            let attributeArray = [];
            if(toggel == 1) {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(emission_tons) )'),'contributor'],[sequelize.fn('date_format', sequelize.col(`EmissionIntensity.year`), '%Y'), 'year']];
            } else {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(emission_revenue) )'),'contributor'],[sequelize.fn('date_format', sequelize.col(`EmissionIntensity.year`), '%Y'), 'year']];
                
            }

            //NEW STATIC DATA CODE
            let getRegionEmissions = await EmissionIntensity.findAll({
                attributes: attributeArray,
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: [sequelize.fn('YEAR', sequelize.col('year'))],
                    raw: true
                });
                console.log('getRegionEmissions',getRegionEmissions);

                
            //check password is matched or not then exec
            if(getRegionEmissions){
                let data = [];
                let baseData = [];
                for(const property of getRegionEmissions) {
                    baseData.push(parseFloat(property.contributor));
                }
                let min = Math.min(...baseData);
                let max = Math.max(...baseData);
                let industrialAverage = min*(20/100);
                let baseLine = max*(15/100);
                let maxY = max*(25/100);
                data.push({
                    dataset:getRegionEmissions,
                    label:[past_year,current_year],
                    industrialAverage: min-industrialAverage,
                    max:max+maxY,
                    min:min,
                    baseLine:max+baseLine,
                    percent:4
                })
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
            //NEW STATIC DATA CODE END


            //OLD CODE START
            // let getRegionEmissions = await Emission.findAll({
            //     attributes: ['id',
            //     [ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year']],
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //         group: [sequelize.fn('YEAR', sequelize.col('date'))],
            //         raw: true
            //     });
            //     console.log('getRegionEmissions',getRegionEmissions);

                
            // //check password is matched or not then exec
            // if(getRegionEmissions){
            //     let data = [];
            //     let contributor = getRegionEmissions[0]['contributor'];
            //     let detractor = getRegionEmissions.map(a => a.detractor);
            //     let baseData = [];
            //     for(const property of getRegionEmissions) {
            //         baseData.push(property.contributor);
            //     }
            //     let min = Math.min(...baseData);
            //     let max = Math.max(...baseData);
            //     let industrialAverage = min*(20/100);
            //     let baseLine = max*(20/100);
            //     data.push({
            //         dataset:getRegionEmissions,
            //         label:[past_year,current_year],
            //         industrialAverage: min-industrialAverage,
            //         baseLine:max+baseLine
            //     })
            //     return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            // } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.getRegionIntensityByQuarter=async(req,res) => {
    try {
            let {region_id, company_id, year, toggel, quarter}=req.body;
            let current_year = parseInt(new Date().getFullYear()-1);
            let past_year = new Date().getFullYear()-2;
           // const where = {emission_type:'region'}
            const where = {}
            if (region_id || company_id || year || quarter) {
                where[Op.and] = []
                where[Op.or] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (company_id) {
                    where[Op.and].push({
                        company_id: company_id
                    })
                }
                if (year) {
                    current_year = parseInt(year);
                    past_year = year-1;
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), past_year))
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year))
                } else {
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
                }

                if (quarter) {
                    where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter))  
                }
            } else {
                if (quarter) {
                    where[Op.and] = []
                    where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year))
                }
            }

            console.log('where',where);
            let attributeArray = [];
            if(toggel == 1) {
                attributeArray = ['id',[ 'emission_tons','contributor'],[sequelize.fn('date_format', sequelize.col(`EmissionIntensity.year`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];
            } else {
                attributeArray = ['id',[ 'emission_revenue','contributor'],[sequelize.fn('date_format', sequelize.col(`EmissionIntensity.year`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];    
            }

            //NEW STATIC DATA CODE
            let getRegionEmissions = await EmissionIntensity.findAll({
                attributes: attributeArray,
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    raw: true
                });
                console.log('getRegionEmissions',getRegionEmissions);

                
            //check password is matched or not then exec
            if(getRegionEmissions){
                let data = [];
                let baseData = [];
                for(const property of getRegionEmissions) {
                    baseData.push(parseFloat(property.contributor));
                }
                let min = Math.min(...baseData);
                let max = Math.max(...baseData);
                let industrialAverage = min*(20/100);
                let baseLine = max*(15/100);
                let maxY = max*(25/100);
                data.push({
                    dataset:getRegionEmissions,
                    label:[quarter-1,parseInt(quarter)],
                    year: [current_year],
                    industrialAverage: min-industrialAverage,
                    max:max+maxY,
                    min:min,
                    baseLine:max+baseLine,
                    percent:4
                })
                return Response.customSuccessResponseWithData(res,'Region Emissions Quarterly',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
            //NEW STATIC DATA CODE END


            //OLD CODE START
            // let getRegionEmissions = await Emission.findAll({
            //     attributes: ['id',
            //     [ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year']],
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //         group: [sequelize.fn('YEAR', sequelize.col('date'))],
            //         raw: true
            //     });
            //     console.log('getRegionEmissions',getRegionEmissions);

                
            // //check password is matched or not then exec
            // if(getRegionEmissions){
            //     let data = [];
            //     let contributor = getRegionEmissions[0]['contributor'];
            //     let detractor = getRegionEmissions.map(a => a.detractor);
            //     let baseData = [];
            //     for(const property of getRegionEmissions) {
            //         baseData.push(property.contributor);
            //     }
            //     let min = Math.min(...baseData);
            //     let max = Math.max(...baseData);
            //     let industrialAverage = min*(20/100);
            //     let baseLine = max*(20/100);
            //     data.push({
            //         dataset:getRegionEmissions,
            //         label:[past_year,current_year],
            //         industrialAverage: min-industrialAverage,
            //         baseLine:max+baseLine
            //     })
            //     return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            // } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionEmissionReduction=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let {region_id}=req.body;
        const where = {}
        if (region_id) {
            where[Op.and] = []
            if (region_id) {
                where[Op.and].push({
                    region_id: region_id
                })
            }
        }
        let getRegionEmissionsReduction = await EmissionReduction.findAll({
            attributes: ['type', ['quater1','Q1'], ['quater2','Q2'],['quater3','Q3'],['quater4','Q4'],'now'],
            where:where});
        //check password is matched or not then exec
        if(getRegionEmissionsReduction){
            // let contributor = getRegionEmissions.map(a => a.contributor);
            // let detractor = getRegionEmissions.map(a => a.detractor);
            // let min = Math.min(...contributor);
            // let max = Math.max(...detractor);
            // let data ={
            //     title : 'Lane Emmision',
            //     type : 'Horizontal Bar Chart',
            //     min:min,
            //     max:max,
            //     dataset:[
            //         {
            //           label: 'Contributor',
            //           data: contributor,
            //           borderColor: '#5888d6',
            //           backgroundColor: '#f7faf9',
            //         },
            //         {
            //           label: 'Detractor',
            //           data: detractor,
            //           borderColor: '#2fa18c',
            //           backgroundColor: '#f7faf9',
            //         }
            //       ]
                
            // }
            return Response.customSuccessResponseWithData(res,'Emissions Reduction',getRegionEmissionsReduction,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

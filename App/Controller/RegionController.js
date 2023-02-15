const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const EmissionEncrypted =require("../models").EmissionEncrypted;
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
const Helper=require("../helper/common-helper");
const CryptoJS = require("crypto-js");


exports.getRegions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Region.findAll();
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
                where[Op.and].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), new Date().getFullYear()-1)
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
            let {region_id, company_id, year, toggel_data}=req.body;
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
            where[Op.or] = [];
            where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), 2020));
            where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), 2021));
            where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), 2022));

            //New Code Start
            // let getRegionEmissions;
            // if(toggel_data == 1) {
            //     getRegionEmissions = await EmissionRegionStatic.findAll({
            //         attributes: ['id','intensity',
            //         [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
            //         'region_id'],
            //         where:where, include: [
            //             {
            //                 model: Region,
            //                 attributes: ['name']
            //             }],
            //         group: ['region_id',sequelize.fn('YEAR', sequelize.col('date'))],
            //         raw: true
            //     });
            // } else {
            //     getRegionEmissions = await EmissionRegionStatic.findAll({
            //         attributes: ['id',['emission','intensity'],
            //         [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
            //         'region_id'],
            //         where:where, include: [
            //             {
            //                 model: Region,
            //                 attributes: ['name']
            //             }],
            //         group: ['region_id',sequelize.fn('YEAR', sequelize.col('date'))],
            //         raw: true
            //     });
            // }
            

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
            //                 tempArray.push(parseInt(property.intensity));
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
            //New Code End


            let getRegionEmissions;
            //OLD code Start
            if(region_id) {
                getRegionEmissions = await EmissionEncrypted.findAll({
                    attributes: ['id',[ sequelize.literal('( SELECT SUM(AES_DECRYPT(total_ton_miles,"tplk9dgf")) )'),'emission_per_ton'],
                    [ sequelize.literal('( SELECT SUM(AES_DECRYPT(emission,"tplk9dgf")) )'),'emission'],
                    [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
                    'region_id'],
                    where:where, 
                    include: [
                        {
                            model: Region,
                            attributes: ['name']
                        }],
                    group: ['region_id',sequelize.fn('YEAR', sequelize.col('date'))],
                    order: [sequelize.fn('YEAR', sequelize.col('date'))],
                    raw: true
                });
            } else {
                getRegionEmissions = await EmissionEncrypted.findAll({
                    attributes: ['id',[ sequelize.literal('( SELECT SUM(AES_DECRYPT(total_ton_miles,"tplk9dgf")) )'),'emission_per_ton'],
                    [ sequelize.literal('( SUM(AES_DECRYPT(emission,"tplk9dgf")) )'),'emission'],
                    [ sequelize.literal('( SELECT YEAR(date) )'),'year'],
                    'region_id'],
                    where:where, 
                    include: [
                        {
                            model: Region,
                            attributes: ['name']
                        }],
                    group: [sequelize.fn('YEAR', sequelize.col('date'))],
                    order: [sequelize.fn('YEAR', sequelize.col('date'))],
                    raw: true
                });
            }
            
            
            
            let getCompanyData = await CompanyData.findOne({
                attributes: ['target_level','base_level'],
                where:{company_id:1},
                raw: true
            });
                console.log('getCompanyData',getCompanyData);
            if(getRegionEmissions){
                let convertToMillion  = 1000000 * 1000000;
                let emissionUnit ='M';
                let intensityUnit = 'g';
                let dataObject = [];
                let minArray = [];
                let maxArray = [];
                let allDataArray = [];
                let maxCountArray = [];
                let targetLevel = [];
              //  const colors = ['#215154','#5F9A80','#D88D49','#C1D3C0','#367C90','#FFCB77','#215154','#5F9A80','#D88D49','#C1D3C0']
             //   const colors = ['#FFCB77','#367C90','#C1D3C0','#D88D49','#5F9A80','#215154','#FFCB77','#367C90','#C1D3C0','#D88D49']
              //  const colors = ['#215154','#5f9a80','#d8856b','#c1d3c0','#367c90','#ffcb77','#215154','#5f9a80','#d8856b','#c1d3c0']
                const colors = ['#ffcb77','#367c90','#c1d3c0','#d8856b','#5f9a80','#215154','#ffcb77','#367c90','#c1d3c0','#d8856b'];
                const lables = [...new Set(getRegionEmissions.map(item => item.year))]
                const regions = [...new Set(getRegionEmissions.map(item => item['Region.name']))]
                console.log('labels', lables);
                console.log('regions', regions);
                console.log('getRegionEmissions', getRegionEmissions);
                for (let i = 0; i < regions.length; i++) {
                    let tempDataObject = {};
                    let tempArray = [];
                    for (const property of getRegionEmissions) {
                        if(region_id) {
                            if(property['Region.name'] == regions[i]) {
                               // let data = (property.emission/property.emission_per_ton).toFixed(2);
                                let data = Helper.roundToDecimal(property.emission/property.emission_per_ton);
                                if(toggel_data == 1){
                                    data = Helper.roundToDecimal(property.emission/convertToMillion);
                                }   
                                
                                tempArray.push(data);
                                if(tempDataObject["name"] === undefined){
                                    tempDataObject.name = property['Region.name'];
                                }
                                if(tempDataObject["year"] === undefined){
                                    tempDataObject.year = property.year;
                                }
                            }  
                        } else {
                            let data = Helper.roundToDecimal(property.emission/property.emission_per_ton);
                            if(toggel_data == 1){
                                data = Helper.roundToDecimal(property.emission/convertToMillion);
                            }   
                            
                            tempArray.push(data);
                            if(tempDataObject["name"] === undefined){
                                tempDataObject.name = property['Region.name'];
                            }
                            if(tempDataObject["year"] === undefined){
                                tempDataObject.year = property.year;
                            }
                        }
                        
                    }
                    allDataArray.push(tempArray);
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
                    targetLevel.push(Helper.roundToDecimal(maxCountArray[i]-(maxCountArray[i]*(20/100))));
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
                let baseLine = Helper.roundToDecimal(base+(base*(15/100)));
                    
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

                dataObject.push({
                    name:'Max',
                    data:Helper.roundToDecimal(baseLine+(baseLine*(10/100))),
                });

                if(toggel_data == 1){
                    dataObject.push({
                        name:'Unit',
                        data:emissionUnit,
                    });
                }  else {
                    dataObject.push({
                        name:'Unit',
                        data:intensityUnit,
                    });
                }

                dataObject.push({
                    name:'lables',
                    data:lables,
                });
              //  var data = CryptoJS.AES.encrypt(JSON.stringify(dataObject), 'Il6xjiYoJHJOaTs3').toString();
                return Response.customSuccessResponseWithData(res,'Region Emissions',dataObject,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
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
        //console.log(type,email,password);return 
        let getRegionTableData = await Emission.findAll({
            attributes: ['id', [ sequelize.literal('( SELECT ROUND(SUM(emission) / SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],
            [ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'total_ton_miles'],
            [ sequelize.literal('( SELECT SUM(emission) )'),'cost'],
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
                group: ['region_id'],
                order:[['intensity','desc']],
                raw:true
            });
        //check password is matched or not then exec
        if(getRegionTableData){
            let c = 0;
            let convertToMillion  = 1000000;
            let totalIntensity = [];
            let totalEmission = [];
            //NEW CODE
            for (const property of getRegionTableData) {
                let data = property.intensity;
                let data2 = property.emission/convertToMillion;
                totalIntensity.push(data);
                totalEmission.push(data2);
            }
            
            const averageIntensity = totalIntensity.reduce((a, b) => a + b, 0) / totalIntensity.length;
            const averageEmission = totalEmission.reduce((a, b) => a + b, 0) / totalEmission.length;
            let avgData = [];
            for (const property of getRegionTableData) {
                let color;
                let intensity = Helper.roundToDecimal(property.intensity);
                let cost = Helper.roundToDecimal(property.cost/convertToMillion);
                if(c < 2) {
                    color = '#d8856b';
                } else if(c == 2) {
                    color = '#efede9';
                } else if(c == 5){
                    color = '#efede9';
                } else {
                    color = '#215154';
                }
               // property.cost = {value:property.intensity,color:color};
                property['intensity'] = (intensity < averageIntensity)?{value:intensity,color:'#215254'}:{value:intensity,color:'#d8856b'};
              //  property['cost'] = (averageEmission < cost)?{value:(property.cost/convertToMillion).toFixed(2)+' tCo2e',color:'#d8856b'}:(property.cost > 5 && property.cost <= 7)?{value:(property.cost/convertToMillion).toFixed(2)+' tCo2e',color:'#EFEDE9'}:{value:(property.cost/convertToMillion).toFixed(2)+' tCo2e',color:'#215254'};
              //  property['service'] = (property.service <= 15)?{value:property.service,color:'#d8856b'}:(property.service > 15 && property.service <= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
            
            //     property['intensity'] = (property.intensity <= 12)?{value:property.intensity,color:'#d8856b'}:(property.intensity > 12 && property.intensity <= 17)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                 property['cost'] = (cost <= averageEmission)?{value:cost,color:'#215254'}:{value:cost,color:'#d8856b'};
            //     property['service'] = (property.service <= 15)?{value:property.service,color:'#d8856b'}:(property.service > 15 && property.service <= 18)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
                c++;
            }
            console.log('getRegionTableData',getRegionTableData);
            return Response.customSuccessResponseWithData(res,'Get Region Table Data',getRegionTableData,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionEmissionData=async(req,res) => {
    try {
        let {region_id, year, quarter, toggel_data}=req.body;
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
            let getRegionEmissions;
            if(toggel_data == 1) {
                getRegionEmissions = await Emission.findAll({
                    attributes: ['id',[ sequelize.literal('( SELECT ROUND(SUM(emission) / SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission']],
                    where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    order:[['emission','desc']],
                    raw: true
                });
            } else {
                getRegionEmissions = await Emission.findAll({
                    attributes: ['id',[ sequelize.literal('( SELECT ROUND(SUM(emission) / SUM(total_ton_miles), 2) )'),'intensity'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission']],
                    where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    order:[['intensity','desc']],
                    raw: true
                });
            }
            
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                let count = 0;
                let contributor = [];
                let detractor = [];
                let unit = 'g';
                let total = [];
                if(toggel_data == 1) {
                    unit = 'tCo2e';
                }
                let convertToMillion  = 1000000;
                //NEW CODE
                for (const property of getRegionEmissions) {
                    let data = property.intensity;
                    if(toggel_data == 1) {
                        data = property.emission/convertToMillion;
                    }
                    
                    total.push(data);
                }
                
                const average = total.reduce((a, b) => a + b, 0) / total.length;
                let avgData = [];
                for (const property of getRegionEmissions) {
                    // let data = property.intensity-average;
                    // if(toggel_data == 1) {
                    //     data = property.emission-average;
                    // }
                    // avgData.push({
                    //     name :property["Region.name"],
                    //     value: data.toFixed(2)
                    // });

                    let data = Helper.roundToDecimal(property.intensity-average);
                    let compareValue = property.intensity;
                    if(toggel_data == 1) {
                        compareValue = property.emission/convertToMillion;
                        data = Helper.roundToDecimal((property.emission/convertToMillion)-average);
                    }
                    if( compareValue > average) {
                        contributor.push({
                            name:property["Region.name"],
                            value:Math.abs(data),
                            color:'#d8856b'
                        })
                    } else {
                        detractor.push({
                            name:property["Region.name"],
                            value:Math.abs(data),
                            color:'#215154'
                        })
                    }
                }

                contributorLenght = contributor.length;
                if(contributorLenght > 0){
                    contributor[contributorLenght-1]['color'] ='#efede9';
                }
                detractorLenght = detractor.length;
                if(detractorLenght > 0){
                    detractor[detractorLenght-1]['color'] ='#efede9';
                }
              //  avgData = avgData.sort((f, s) => s - f);
                //  let c =0;
                // for (const property of avgData) {
                //     if(c < 2) {
                //             contributor.push({
                //             name:property["name"],
                //             value:Math.abs(property["value"]),
                            
                //             color:'#d8856b'
                //         })
                //     } else if(c == 2) {
                //             contributor.push({
                //                 name:property["name"],
                //                 value:Math.abs(property["value"]),
                //                 color:'#efede9'
                //             });
                //     } else if(c == 5){
                //             detractor.push({
                //                 name:property["name"],
                //                 value:Math.abs(property["value"]),
                //             color:'#efede9'
                //         })
                //     } else {
                //             detractor.push({
                //                 name:property["name"],
                //                 value:Math.abs(property["value"]),
                //             color:'#215154'
                //         })
                //     }
                //     c++;
                // }

            //     console.log('avgData',avgData);
            //   //  avgData = avgData.reverse();
                // for (const property of getRegionEmissions) {
                // }
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
                    detractor:detractor,
                    unit :unit
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
            //old filters
            // if (region_id || company_id || year || quarter) {
            //     where[Op.and] = []
            //     where[Op.or] = []
            //     if (region_id) {
            //         where[Op.and].push({
            //             region_id: region_id
            //         })
            //     }
            //     if (company_id) {
            //         where[Op.and].push({
            //             company_id: company_id
            //         })
            //     }
            //     if (year) {
            //         current_year = parseInt(year);
            //         past_year = year-1;
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
                    
            //     } else {
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
            //     }

            //     // if (quarter) {
            //     //     if(quarter != 1) {
            //     //         where[Op.and].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter))
            //     //     } else {
            //     //         where[Op.or].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter-1))
            //     //         where[Op.or].push(sequelize.where(sequelize.fn('quarter', sequelize.col('date')), quarter))
            //     //     }
                    
            //     // }
            // } else {
            //         where[Op.and] = []
            //         where[Op.or] = []
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), past_year))
            //         where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('year')), current_year))
            // }
            console.log('where',where);
            let attributeArray = [];
            if(toggel == 1) {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'total_ton_miles'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];
            } else {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'total_ton_miles'],[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];
                
            }

            //NEW STATIC DATA CODE
            // let getRegionEmissions = await EmissionIntensity.findAll({
            //     attributes: attributeArray,
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //         group: [sequelize.fn('YEAR', sequelize.col('year'))],
            //         raw: true
            //     });
            //     console.log('getRegionEmissions',getRegionEmissions);

                
            //check password is matched or not then exec
            // if(getRegionEmissions){
            //     let data = [];
            //     let baseData = [];
            //     for(const property of getRegionEmissions) {
            //         baseData.push(parseFloat(property.contributor));
            //     }
            //     let min = Math.min(...baseData);
            //     let max = Math.max(...baseData);
            //     let industrialAverage = min*(15/100);
            //     let baseLine = max*(15/100);
            //     let maxY = max*(25/100);
            //     data.push({
            //         dataset:getRegionEmissions,
            //         label:[past_year,current_year],
            //         industrialAverage: min-industrialAverage,
            //         max:max+maxY,
            //         min:min,
            //         baseLine:max+baseLine,
            //         percent:4
            //     })
            //     return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            // } else { return Response.errorRespose(res,'No Record Found!');}
            //NEW STATIC DATA CODE END


            //OLD CODE START
            let getRegionEmissions = await Emission.findAll({
                attributes: attributeArray,
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: [sequelize.fn('YEAR', sequelize.col('date'))],
                    raw: true
                });
                console.log('getRegionEmissions',getRegionEmissions);

                
            //check password is matched or not then exec
            if(getRegionEmissions){
                let data = [];
                let convertToMillion  = 1000000;
                let contributor = getRegionEmissions[0]['contributor'];
                let detractor = getRegionEmissions.map(a => a.detractor);
                let baseData = [];
                for(const property of getRegionEmissions) {
                    let data = Helper.roundToDecimal(property.emission/property.total_ton_miles);
                    property.intensity = data;
                    baseData.push(data);
                    if(current_year == property.year) {
                        maxYearValue = data;
                    }
                }
                let min = Math.min(...baseData);
                let max = Math.max(...baseData);
                let industrialAverage = min*(2/100);
                let baseLine = max*(20/100);
                data.push({
                    dataset:getRegionEmissions,
                    label:[past_year,current_year],
                    industrialAverage: Helper.roundToDecimal(133.76),
                    baseLine:Helper.roundToDecimal(max+baseLine),
                    max: Helper.roundToDecimal(maxYearValue),
                    graphMax: Helper.roundToDecimal((max+baseLine)+(max+baseLine)*(15/100))
                })
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
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

            let convertToMillion  = 1000000;
            let attributeArray = [];
            if(toggel == 1) {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],[ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'emission_per_ton'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];
            } else {
                attributeArray = ['id',[ sequelize.literal('( SELECT SUM(emission) )'),'emission'],[ sequelize.literal('( SELECT SUM(total_ton_miles) )'),'emission_per_ton'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year'],[sequelize.fn('quarter', sequelize.col('date')), 'quarter']];
            }

            //NEW STATIC DATA CODE
            // let getRegionEmissions = await EmissionIntensity.findAll({
            //     attributes: attributeArray,
            //     where:where, include: [
            //         {
            //             model: Region,
            //             attributes: ['name']
            //         }],
            //         raw: true
            //     });
            //     console.log('getRegionEmissions',getRegionEmissions);

            let getRegionEmissions = await Emission.findAll({
                attributes: attributeArray,
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: [sequelize.fn('YEAR', sequelize.col('date'))],
                    raw: true
                });
                console.log('getRegionEmissions',getRegionEmissions);

                
            //check password is matched or not then exec
            if(getRegionEmissions){
                let data = [];
                let baseData = [];
                let maxYearValue;
                for(const property of getRegionEmissions) {
                  //  let data = (property.emission/property.emission_per_ton).toFixed(2);
                    let data = Helper.roundToDecimal(property.emission/convertToMillion);
                    property.contributor = data;
                    baseData.push(data);
                    if(current_year == property.year) {
                        maxYearValue = data;
                    }
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
                    industrialAverage: Helper.roundToDecimal(133.76),
                    max:Helper.roundToDecimal(max+maxY),
                    min:Helper.roundToDecimal(min),
                    baseLine:Helper.roundToDecimal(max+baseLine),
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
        let {region_id, year}=req.body;
        let current_year = parseInt(new Date().getFullYear()-1);
        let next_year = current_year+1;
           // const where = {emission_type:'region'}
            const where = {}
            if (region_id || year) {
                where[Op.and] = []
                where[Op.or] = []
                if (region_id) {
                    where[Op.and].push({
                        region_id: region_id
                    })
                }
                if (year) {
                    current_year = parseInt(year);
                    next_year = parseInt(year)+1;
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year))
                    
                    if(next_year != 2023) {
                        where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), next_year))
                    }
                }
            }
        // let getRegionEmissionsReduction = await EmissionReduction.findAll({
        //     attributes: ['type', ['quater1','Q1'], ['quater2','Q2'],['quater3','Q3'],['quater4','Q4'],'now'],
        //     where:where});
        let getRegionEmissionsReduction = await Emission.findAll({
            attributes :[
            [ sequelize.literal('( SELECT round((SUM(emission) / 1000000),1))'),'intensity'],
            [sequelize.fn('QUARTER', sequelize.col('date')),'quarter'],
            [sequelize.fn('YEAR', sequelize.col('date')),'year']
        ],
            where:where,
            group: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date')) ],
            order: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date'))]
        });
       // console.log('getRegionEmissionsReduction',getRegionEmissionsReduction);
        //check password is matched or not then exec
        if(getRegionEmissionsReduction){
            let company_level = [];
            let targer_level = [];
            let max_array = [];
            let base_level =[];
            let count = 0
            let intialCompanyLevel;
            let last_intensity = [];
            let last_target = [];
            for(const property of getRegionEmissionsReduction) {
                //if(count < 6) {
                    company_level.push(Helper.roundToDecimal(property.intensity));
                    if(intialCompanyLevel == undefined){
                        intialCompanyLevel = property.intensity;
                    }
                    intialCompanyLevel = Helper.roundToDecimal((intialCompanyLevel-(intialCompanyLevel*10/100)));
                    targer_level.push(intialCompanyLevel);
                    max_array.push(property.intensity);
                    last_intensity = property.intensity;
                    last_target = intialCompanyLevel;
               // }
                count++;
            }
            if(next_year == 2023) {
                let countData = 0
                for (let i = 0; i < 4; i++) {
                    last_intensity = Helper.roundToDecimal((last_intensity-(last_intensity*7/100)));
                    company_level.push(last_intensity);
                    last_target = Helper.roundToDecimal((last_target-(last_target*10/100)));
                    targer_level.push(last_target);
                }
            }
            let max = Math.max(...max_array);
            let maxData = Helper.roundToDecimal(max+(max*30/100));
            base_level.push(maxData);
            let data = {
                company_level : company_level,
                targer_level : targer_level,
                base_level: base_level,
                max : Helper.roundToDecimal(maxData+(maxData*20/100)),
                year : [current_year, next_year]
            }
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
           // let convertToMillion  = 1000000
            // let data = {
            //     company_level : [990,950,901,810,750],
            //     targer_level : [850,780,720,680,660],
            //     base_level: [1200]
            // }

            // company_array = [
            //     parseFloat((44370952192.83499/convertToMillion).toFixed(2)),
            //     parseFloat((13292584331.19238/convertToMillion).toFixed(2)),
            //     parseFloat((4624983337.467285/convertToMillion).toFixed(2)),
            //     parseFloat((4124983337.467285/convertToMillion).toFixed(2)),
            //     parseFloat((3724983337.467285/convertToMillion).toFixed(2)),
            // ];
            // let target_array =[]
            // let base_level = Math.max(...company_array);
            
            // company_array.forEach(element => {
            //     let data = parseFloat((element*30/100).toFixed(2));
            //     data = element-data;
            //     target_array.push(parseFloat(data.toFixed(2)));
            // });

            // let data = {
            //     company_level : company_array,
            //     targer_level : target_array,
            //     base_level: [base_level],
            //     max : base_level+(base_level*20/100)
            // }
            return Response.customSuccessResponseWithData(res,'Emissions Reduction',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


exports.getRegionEmissionReductionRegion=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let {region_id, year}=req.body;
        let current_year = parseInt(new Date().getFullYear()-1);
        let next_year = current_year+1;
           // const where = {emission_type:'region'}
            const whereRegion = {}
            const where = {}
            if (region_id || year) {
                whereRegion[Op.and] = []
                where[Op.and] = []
                where[Op.or] = []
                whereRegion[Op.or] = []
                if (region_id) {
                    whereRegion[Op.and].push({
                        region_id: region_id
                    })
                }
                if (year) {
                    current_year = parseInt(year);
                    next_year = parseInt(year)+1;
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year))
                    whereRegion[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year))
                    if(next_year != 2023) {
                        where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), next_year))
                        whereRegion[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), next_year))
                    }
                }
            }
        // let getRegionEmissionsReduction = await EmissionReduction.findAll({
        //     attributes: ['type', ['quater1','Q1'], ['quater2','Q2'],['quater3','Q3'],['quater4','Q4'],'now'],
        //  [sequelize.literal('( SELECT ROUND(SUM(emission) DIV SUM(total_ton_miles), 2) )'),'intensity'],
        //     where:where});
        let getRegionEmissionsReduction = await Emission.findAll({
            attributes :[ 
            [ sequelize.literal('( SELECT SUM(emission) / 1000000)'),'intensity'],
            [sequelize.fn('QUARTER', sequelize.col('date')),'quarter'],
            [sequelize.fn('YEAR', sequelize.col('date')),'year']
        ],
            where:where,
            group: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date')) ],
            order: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date'))]
        });

        let regionEmissionsReduction = await Emission.findAll({
            attributes :[
            [ sequelize.literal('( SELECT SUM(emission) / 1000000)'),'intensity'],
            [sequelize.fn('QUARTER', sequelize.col('date')),'quarter'],
            [sequelize.fn('YEAR', sequelize.col('date')),'year']
        ],
            where:whereRegion,
            group: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date')) ],
            order: [sequelize.fn('YEAR', sequelize.col('date')),sequelize.fn('QUARTER', sequelize.col('date'))]
        });
        console.log('getRegionEmissionsReduction',getRegionEmissionsReduction);
        console.log('regionEmissionsReduction',regionEmissionsReduction);
        //check password is matched or not then exec
        if(getRegionEmissionsReduction){
            let company_level = [];
            let targer_level = [];
            let max_array = [];
            let base_level =[];
            let count = 0
            let last_intensity = [];
            let region_data = [];
            let last_target = [];
            let last_region_data = 0;
            let intialCompanyLevel;
            for(const property of getRegionEmissionsReduction) {
                //if(count < 6) {
                    company_level.push(Helper.roundToDecimal(property.intensity));
                    // if(intialCompanyLevel == undefined){
                    //     intialCompanyLevel = property.intensity;
                    // }
                    // intialCompanyLevel = parseFloat((intialCompanyLevel-(intialCompanyLevel*10/100)).toFixed(2));
                    // targer_level.push(intialCompanyLevel);
                 //   max_array.push(property.intensity);
                 //   last_intensity = property.intensity;
                 //   last_target = intialCompanyLevel;
               // }
                count++;
            }
            for(const property of regionEmissionsReduction) {

                region_data.push(Helper.roundToDecimal(property.intensity));
                if(intialCompanyLevel == undefined){
                    intialCompanyLevel = property.intensity;
                }
                intialCompanyLevel = Helper.roundToDecimal((intialCompanyLevel-(intialCompanyLevel*10/100)));
                last_target = intialCompanyLevel;
                targer_level.push(intialCompanyLevel);
                last_region_data = property.intensity;
                max_array.push(property.intensity);
            }
            if(next_year == 2023) {
                let countData = 0
                for (let i = 0; i < 4; i++) {
                    last_intensity = Helper.roundToDecimal((last_intensity-(last_intensity*7/100)));
                    company_level.push(last_intensity);
                    last_target = Helper.roundToDecimal((last_target-(last_target*10/100)));
                    targer_level.push(last_target);
                    last_region_data = Helper.roundToDecimal((last_region_data-(last_region_data*10/100)));
                    region_data.push(last_region_data);
                }
            }
            let max = Math.max(...max_array);
            let maxData = Helper.roundToDecimal(max+(max*30/100));
            base_level.push(maxData);
            let data = {
                company_level : company_level,
                targer_level : targer_level,
                region_level : region_data,
                base_level: base_level,
                max : Helper.roundToDecimal(maxData+(maxData*20/100)),
                year : [current_year, next_year]
            }
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
           // let convertToMillion  = 1000000
            // let data = {
            //     company_level : [990,950,901,810,750],
            //     targer_level : [850,780,720,680,660],
            //     base_level: [1200]
            // }

            // company_array = [
            //     parseFloat((44370952192.83499/convertToMillion).toFixed(2)),
            //     parseFloat((13292584331.19238/convertToMillion).toFixed(2)),
            //     parseFloat((4624983337.467285/convertToMillion).toFixed(2)),
            //     parseFloat((4124983337.467285/convertToMillion).toFixed(2)),
            //     parseFloat((3724983337.467285/convertToMillion).toFixed(2)),
            // ];
            // let target_array =[]
            // let base_level = Math.max(...company_array);
            
            // company_array.forEach(element => {
            //     let data = parseFloat((element*30/100).toFixed(2));
            //     data = element-data;
            //     target_array.push(parseFloat(data.toFixed(2)));
            // });

            // let data = {
            //     company_level : company_array,
            //     targer_level : target_array,
            //     base_level: [base_level],
            //     max : base_level+(base_level*20/100)
            // }
            return Response.customSuccessResponseWithData(res,'Emissions Reduction',data,200)
        } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}
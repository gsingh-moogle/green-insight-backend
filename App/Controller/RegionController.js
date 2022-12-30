const sequelize = require('sequelize');
const Op = sequelize.Op;
const User = require("../models").User;
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const Vendor =require("../models").Vendor;
const Lane =require("../models").Lane;
const Company =require("../models").Company;
const CompanyData =require("../models").CompanyData;
const Response=require("../helper/api-response");


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
            }
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity'],
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
                let targetLevel = [];
                const colors = ['#FFCB77','#367C90','#215154','#5F9A80','#D88D49','#215154','#FFCB77','#367C90','#215154','#5F9A80']
                const lables = [...new Set(getRegionEmissions.map(item => item.year))]
                const regions = [...new Set(getRegionEmissions.map(item => item['Region.name']))]
                console.log('labels', lables);
                console.log('regions', regions);
                
                for (let i = 0; i < regions.length; i++) {
                    let tempDataObject = {};
                    let tempArray = [];
                    for (const property of getRegionEmissions) {
                        if(property['Region.name'] == regions[i]) {
                            tempArray.push(property.intensity);
                            if(tempDataObject["name"] === undefined){
                                tempDataObject.name = property['Region.name'];
                            }
                            if(tempDataObject["year"] === undefined){
                                tempDataObject.year = property.year;
                            }
                        }  
                    }
                    let min = Math.min(...tempArray);

                    let max = Math.max(...tempArray);
                    let target = max-(max*(10/100));
                    minArray.push(min);
                    maxArray.push(max);
                    targetLevel.push(target);
                    tempDataObject.data = tempArray;
                    tempDataObject.color = colors[i];
                    dataObject.push(tempDataObject);
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

                let base = Math.max(...maxArray);

                let baseLine = base+(base*(20/100));
                    
                dataObject.push({
                    companyLevel:maxArray,
                    targetLine:targetLevel,
                    baseLine:baseLine
                })
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
            attributes: ['id', 'gap_to_target', 'intensity','cost','service',
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
            });
        //check password is matched or not then exec
        if(getRegionTableData){
            for (const property of getRegionTableData) {
                property['intensity'] = (property.intensity <= 500)?{value:property.intensity,color:'#D88D49'}:(property.intensity > 500 && property.intensity >= 700)?{value:property.intensity,color:'#EFEDE9'}:{value:property.intensity,color:'#215254'};
                property['cost'] = (property.cost <= 5000)?{value:property.cost,color:'#D88D49'}:(property.cost > 5000 && property.cost >= 7000)?{value:property.cost,color:'#EFEDE9'}:{value:property.cost,color:'#215254'};
                property['service'] = (property.service <= 500)?{value:property.service,color:'#D88D49'}:(property.service > 500 && property.service >= 700)?{value:property.service,color:'#EFEDE9'}:{value:property.service,color:'#215254'};
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
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(intensity) )'),'intensity']],
                where:where, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                    group: ['region_id'],
                    limit : 10,
                    raw: true
                });
              //  console.log('getRegionEmissions',getRegionEmissions);
            //check password is matched or not then exec
            if(getRegionEmissions){
                const data = getRegionEmissions.map((item) => [item["Region.name"],item.intensity]);
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

exports.getRegionIntensityByYear=async(req,res) => {
    try {
            let {region_id, company_id, year}=req.body;
            let current_year = parseInt(new Date().getFullYear());
            let past_year = new Date().getFullYear()-1;
            const where = {emission_type:'region'}
            if (region_id || company_id || year) {
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
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), past_year)
                    )
                    where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year)
                    )
                    
                }
            } else {
                where[Op.and] = []
                where[Op.or] = []
                where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), past_year)
                    )
                where[Op.or].push(sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), current_year)
                    )
            }

            
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id',
                [ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],[sequelize.fn('date_format', sequelize.col(`Emission.date`), '%Y'), 'year']],
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
                let contributor = getRegionEmissions[0]['contributor'];
                let detractor = getRegionEmissions.map(a => a.detractor);
                let min = Math.min(getRegionEmissions[0]['contributor'],getRegionEmissions[1]['contributor']);
                let max = Math.max(getRegionEmissions[0]['contributor'],getRegionEmissions[1]['contributor']);
                let industrialAverage = min*(20/100);
                let baseLine = max*(20/100);
                data.push({
                    dataset:getRegionEmissions,
                    label:[past_year,current_year],
                    industrialAverage: min-industrialAverage,
                    baseLine:max+baseLine
                })
                return Response.customSuccessResponseWithData(res,'Region Emissions',data,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}

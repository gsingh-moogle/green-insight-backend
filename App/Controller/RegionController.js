const sequelize = require('sequelize');
const Emission =require("../models").Emission;
const Region =require("../models").Region;
const Facility =require("../models").Facility;
const Vendor =require("../models").Vendor;
const Lane =require("../models").Lane;
const Company =require("../models").Company;
const Response=require("../helper/api-response");


exports.getRegions=async(req,res) => {
    try {
        //console.log(type,email,password);return 
        let getRegionEmissions = await Region.findAll();
        let getCompanies = await Company.findAll();
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
            let {region_id}=req.body;
            if(!region_id) {
                return Response.errorRespose(res,'region_id is required!');
            }
            //console.log(type,email,password);return 
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id','contributor','detractor'],
                where:{emission_type:'region'}, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
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

exports.getRegionEmissionsMonthly=async(req,res) => {
    try {
            //console.log(type,email,password);return 
            let {region_id}=req.body;
            if(!region_id) {
                return Response.errorRespose(res,'region_id is required!');
            }
            let getRegionEmissions = await Emission.findAll({
                attributes: ['id',[ sequelize.literal('( SELECT SUM(contributor) )'),'contributor'],
                [ sequelize.literal('( SELECT SUM(detractor) )'),'detractor'],
                [ sequelize.literal('( SELECT MONTHNAME(date) )'),'month']],
                where:{emission_type:'region', region_id:region_id}, include: [
                    {
                        model: Region,
                        attributes: ['name']
                    }],
                group: [sequelize.fn('MONTHNAME', sequelize.col('date'))],
                raw: true
                });
            //check password is matched or not then exec
            if(getRegionEmissions){
                let contributor = [];
                let detractor = [];
                let monthDate= ["January","February","March","April","May","June","July",
                "August","September","October","November","December"];
                for (let i = 0; i < monthDate.length; i++) {
                    let month = getRegionEmissions.find(o => o.month == monthDate[i]);
                    intensity1 = 0;
                    intensity2 = 0;
                    if(month && month.contributor) intensity1 = month.contributor;
                    if(month && month.detractor) intensity2 = month.detractor;
                    contributor.push(intensity1);
                    detractor.push(intensity2);
                }
                let min = Math.min(...contributor);
                let max = Math.max(...detractor);
                let data ={
                    title : 'Region Emmision',
                    type : 'Horizontal Bar Chart',
                    label:monthDate,
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
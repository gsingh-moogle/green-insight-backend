const sequelize = require('sequelize');
const Op = sequelize.Op;
const Company =require("../models").Company;
const CompanyData =require("../models").CompanyData;
const Response=require("../helper/api-response");

exports.getCompanyData=async(req,res) => {
    try {

        
            let {company_id,region_id}=req.body;
            const where = {company_id: 1}            
            let getCompanyData = await req.db.CompanyData.findOne({
                where:where,
                include: [
                {
                    model: req.db.Company,
                    attributes: ['name']
                }]
            });
            //check password is matched or not then exec
            if(getCompanyData){
                return Response.customSuccessResponseWithData(res,'Company Data',getCompanyData,200)
            } else { return Response.errorRespose(res,'No Record Found!');}
    } catch (error) {
        console.log('____________________________________________________________error',error);
    }
}


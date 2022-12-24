const sequelize = require('sequelize');
const Op = sequelize.Op;
const Company =require("../models").Company;
const CompanyData =require("../models").CompanyData;
const Response=require("../helper/api-response");

exports.getCompanyData=async(req,res) => {
    try {
            let {company_id,region_id}=req.body;
            const where = {}
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
            } else {
                const where = {company_id:'1'}
            }
            
            //console.log(type,email,password);return 
            let getCompanyData = await CompanyData.findOne({
                where:where,
                include: [
                {
                    model: Company,
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


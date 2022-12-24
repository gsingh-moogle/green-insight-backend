const Company =require("../models").Company;
const CompanyData =require("../models").CompanyData;
const Response=require("../helper/api-response");

exports.getCompanyData=async(req,res) => {
    try {
            let {company_id}=req.body;
            if(!company_id) {
                return Response.errorRespose(res,'Company_id is required!');
            }
            
            //console.log(type,email,password);return 
            let getCompanyData = await CompanyData.findOne({
                where:{company_id:company_id},
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


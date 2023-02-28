const jwt=require("jsonwebtoken");
const helper=require("../helper/api-response");
const DB = require("../models");

const validateAdmin= async (req, res, next) => {
    try {
     const token = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:'';
      if (!token) {
        return helper.unAuthorizedResponse(res, 'Unauthorized');
      }
      let decode = jwt.verify(token, process.env.JWTSECRETKEY);
      let userData = await DB.main_db.models.User.findOne({
        where:{id:decode.data.id }
      });
      if (!userData) {
          return helper.unAuthorizedResponse(res, 'User not found!');
      } else if(decode.data.company.db_name) {
        req.currentUser = decode;
        req.db = DB[decode.data.company.db_name].models;
        next();
      } else{
        return helper.unAuthorizedResponse(res, 'User DB not found!');
      }   
    } catch (err) {
      console.log('__________________________________________',err);
      return helper.unAuthorizedResponse(res, 'Unauthorized')
    }
  }

  module.exports = { validateAdmin };
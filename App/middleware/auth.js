const jwt=require("jsonwebtoken");
const {User}=require("../models");
const helper=require("../helper/api-response");
const DB = require("../models");

const validateAdmin= async (req, res, next) => {
    try {
     const token = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:'';
     console.log('token',token);
      if (!token) {
        return helper.unAuthorizedResponse(res, 'Unauthorized');
      }
      let decode = jwt.verify(token, process.env.JWTSECRETKEY);
      let userData = await DB.main_db.models.User.findOne({id:decode.id });
      if (!userData) {
          return helper.unAuthorizedResponse(res, 'User not found!');
      }
      else{
          req.currentUser = decode;
          next();
      }   
    } catch (err) {
      console.log('__________________________________________',err);
      return helper.unAuthorizedResponse(res, 'Unauthorized')
    }
  }

  module.exports = { validateAdmin };
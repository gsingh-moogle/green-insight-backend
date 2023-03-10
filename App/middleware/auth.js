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
      let userData = await DB.User.findOne({
        where:{id:decode.data.id }
      });
      if (userData) {
          req.currentUser = decode;
          req.db = DB;
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
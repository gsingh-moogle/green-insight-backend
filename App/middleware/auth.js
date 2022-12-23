const jwt=require("jsonwebtoken");
const User=require("../models").User;
const helper=require("../helper/api-response");

const validateAdmin=async(req, res, next) => {
    try {
     const token = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:'';
      if (!token) {
        return helper.unAuthorizedResponse(res, 'Unauthorized');
      }
      let decode = jwt.verify(token, process.env.JWTSECRETKEY);
      let userData = await User.findOne({_id:decode.id });
      if (!userData) {
          return helper.unAuthorizedResponse(res, 'User not found!');
      }
      else{
          req.currentUser = userData;
          next();
      }   
    } catch (err) {
      console.log('__________________________________________',err);
      return helper.unAuthorizedResponse(res, 'Unauthorized')
    }
  }

  exports.validateAdmin;
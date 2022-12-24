const express =require("express");
const router=express.Router();
const GreenInsightController=require("../Controller/GreenInsightController");
const RegionController=require("../Controller/RegionController");
const UserController=require("../Controller/UserController");
const CompanyController=require("../Controller/CompanyController");
//const Auth=require("../middleware/auth");

router.post("/login",GreenInsightController.login);
router.get("/get-regions",RegionController.getRegions);
router.post("/get-region-emission-graph",RegionController.getRegionEmissions);
router.post("/get-region-emission-monthly",RegionController.getRegionEmissionsMonthly);
router.get("/get-facility-emission-graph",RegionController.getFacilityEmissions);
router.get("/get-vendor-emission-graph",RegionController.getVendorEmissions);
router.get("/get-lane-emission-graph",RegionController.getLaneEmissions);
router.get("/get-user-profile",UserController.getProfileDetails);
router.post("/get-company-data",CompanyController.getCompanyData);

module.exports=router;
const express =require("express");
const router=express.Router();
const {validateAdmin} = require("../middleware/auth");
const GreenInsightController=require("../Controller/GreenInsightController");
const RegionController=require("../Controller/RegionController");
const UserController=require("../Controller/UserController");
const CompanyController=require("../Controller/CompanyController");
const FacilitiesController=require("../Controller/FacilitiesController");
const VendorController=require("../Controller/VendorController");

//Auth API's
router.post("/login",GreenInsightController.login);
router.use(validateAdmin);
router.get("/get-regions",RegionController.getRegions);
router.post("/get-region-emission-graph",RegionController.getRegionEmissions);
router.post("/get-region-emission-monthly",RegionController.getRegionEmissionsMonthly);
router.post("/get-region-intensity",RegionController.getRegionIntensity);
router.get("/get-facility-emission-graph",RegionController.getFacilityEmissions);
router.get("/get-vendor-emission-graph",RegionController.getVendorEmissions);
router.get("/get-lane-emission-graph",RegionController.getLaneEmissions);
router.get("/get-user-profile",UserController.getProfileDetails);
router.post("/get-company-data",CompanyController.getCompanyData);

//By Region API's
router.post("/get-region-table-data",RegionController.getRegionTableData);
router.post("/get-region-emission-data",RegionController.getRegionEmissionData);

//By Facilities API's
router.post("/get-facilities-table-data",FacilitiesController.getFacilitiesTableData);
router.post("/get-facilities-emission-data",FacilitiesController.getFacilitiesEmissionData);

//By Vendor API's
router.post("/get-vendor-table-data",VendorController.getVendorTableData);
router.post("/get-vendor-emission-data",VendorController.getVendorEmissionData);

module.exports=router;
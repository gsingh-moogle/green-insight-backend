const express =require("express");
const router=express.Router();
const {validateAdmin} = require("../middleware/auth");
const {createConnection} = require("../middleware/dynamicConnection");
const GreenInsightController=require("../Controller/GreenInsightController");
const RegionController=require("../Controller/RegionController");
const UserController=require("../Controller/UserController");
const CompanyController=require("../Controller/CompanyController");
const FacilitiesController=require("../Controller/FacilitiesController");
const VendorController=require("../Controller/VendorController");
const LaneController=require("../Controller/LaneController");
const ProjectController=require("../Controller/ProjectController");
const DecarbController=require("../Controller/DecarbController");
const Validations=require("../helper/api-validator");
//Auth API's
router.post("/login",GreenInsightController.login);
router.post("/verify-otp",GreenInsightController.verifyOtp);
router.use(validateAdmin);
// router.use(createConnection);
// Verify Otp


//Sus Dashboard
router.get("/get-regions",RegionController.getRegions);
// router.post("/get-region-emission-graph",RegionController.getRegionEmissions);
router.post("/get-region-emission-monthly",RegionController.getRegionEmissionsMonthly);
// router.post("/get-region-intensity",RegionController.getRegionIntensity);
router.post("/get-region-intensity-yearly",RegionController.getRegionIntensityByYear);
router.post("/get-region-intensity-quarterly",RegionController.getRegionIntensityByQuarter);

// Emission reduction
router.post("/get-region-emission-reduction",RegionController.getRegionEmissionReduction);
router.post("/get-region-reduction",RegionController.getRegionEmissionReductionRegion);

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

//By Lane API's
router.post("/get-lane-table-data-hight-intensity",LaneController.getLaneTableDataHighIntensity);
 router.post("/get-lane-table-data-low-intensity",LaneController.getLaneTableDataLowIntensity);
router.post("/get-lane-emission-data",LaneController.getLaneEmissionData);

//Project API's
router.post("/get-project-count",ProjectController.getProjectCount);
router.post("/save-project",Validations.projectRegisterValidator(),ProjectController.saveProject);
router.post("/save-project-rating",Validations.projectRatingValidator(),ProjectController.saveProjectRating);
router.post("/get-project-list",ProjectController.getProjectList);
router.get("/get-project-search-list",ProjectController.getProjectSearchList);
router.delete("/delete-project",ProjectController.deleteProject);

// Decarb API's
router.post("/get-recommended-levers",DecarbController.getRecommendedLevers);
router.post("/get-customize-levers",DecarbController.getCustomizeLevers);



module.exports=router;
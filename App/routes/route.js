const express =require("express");
const router=express.Router();
const GreenInsightController=require("../Controller/GreenInsightController");
const RegionController=require("../Controller/RegionController");

router.post("/login",GreenInsightController.login);
router.get("/get-region-emission-graph",RegionController.getRegionEmissions);
router.get("/get-facility-emission-graph",RegionController.getFacilityEmissions);
router.get("/get-vendor-emission-graph",RegionController.getVendorEmissions);
router.get("/get-lane-emission-graph",RegionController.getLaneEmissions);
module.exports=router;
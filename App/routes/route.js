const express =require("express");
const router=express.Router();
const GreenInsightController=require("../Controller/GreenInsightController");

router.post("/login",GreenInsightController.login);
module.exports=router;
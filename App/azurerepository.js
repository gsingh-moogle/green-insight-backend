require("dotenv").config();
const storage= require("azure-storage");
const uuid=require("uuid");
const connStr = Object.freeze(process.env.HOST);
const fs=require("fs");
var accountName = Object.freeze(process.env.ACCOUNT_NAME); //account name define
var accessKey = Object.freeze(process.env.ACCESS_KEY); //access key define
//var host = Object.freeze(process.env.HOST); //host define here

//instance create for azure server
var blobService = storage.createBlobService(accountName, accessKey);

//read data from blob by conainer name and blobname storage => container => blob
exports.readDataFromBlob = async (container,blobname,callback) => {
  
      blobService.getBlobToText(container, blobname, function(error, text){
        if(error){
            console.error('******************************`',error);
            return res.send('Fail to download blob');
        } else {
           var data = JSON.stringify(text);
           var rawDataq = JSON.parse(data);
           return callback(rawDataq);
        }
    });
}

//create container if not exist thenb make a new container
exports.createNewContainerIfNotExists = (containerName) =>  {
    try {
        blobService.createContainerIfNotExists(containerName, {publicAccessLevel:'blob'},function(error, result, response){
            if(!error){
              // Container exists and allows
              // anonymous read access to blob
              // content and metadata within this container
              console.log("response is here__________________#_#_#_#_#_#_#_#_#_#_#_",result,response);
            }
          });
    } catch {console.log('__________________________________________________error',error);}
}
//container would be delete while hitting
exports.deleteContainer = (contianerName) => {
  try {
    blobService.deleteContainerIfExists(contianerName,(error,result) => {
      if(error){
        throw error;
      } else {
        console.log('_____________________________________________result',result);
      } 
    });
  } catch (error) {
    console.log('___________________________________________error',error);
  }
}

exports.createFileToBlob = (containerName,blobName,filename) =>  {
  try {
    blobService.createBlockBlobFromLocalFile(containerName, blobName, filename, function(error, result, response){
      if(!error){
        // file uploaded
        console.log('_____________________write file in blob',result, response);
      }
  });
  } catch (error) {
    console.log('_______________________________________________error',error);
  }
}

// get List Of all Blobs from container
exports.getAllListBlobsFromContainer = (containerName) =>  {
    try {
      blobService.listBlobsSegmented(containerName, null, function(error, result, response){
        if(!error){
          // result.entries contains the entries
          // If not all blobs were returned, result.continuationToken has the continuation token.
          console.log("___________________________________________________result response ",result,response);
        }
    });
    } catch (error) {
      console.log('___________________________________________error',error);
    }
}

exports.uploadFIleToAzureContainer = async(filename) => {
  try { 
    const containerClient=blobService.getContainerClient('test')
    const blobclient=containerClient.getBlockBlobClient('test.jpg')
    let fileStream = fs.createReadStream('E:\\dog.jpg');
    const blobOptions = { blobHTTPHeaders: { blobContentType: 'image/jpg' } };
    blobclient.uploadStream(fileStream,undefined ,undefined ,blobOptions)
  } catch (error) {
    console.log("___________________________________________________Error",error);
  }
}
import { LANG } from "./../constants";

var S3_CREDENTIALS = require("aws-sdk/clients/s3");

const config = new S3_CREDENTIALS({
  accessKeyId: window.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: window.env.REACT_APP_S3_SECRET_ACCESS_KEY_ID,
  region: window.env.REACT_APP_S3_REGION
});

const S3 = {
  uploadFile(file, fileName, dirName) {
    const params = {
      Bucket: window.env.REACT_APP_S3_BUCKET + dirName,
      Key: fileName,
      Body: file,
      ContentType: LANG.EXCEL
    };
    config.upload(params, function(err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
    return true;
  },

  deleteFile(fileName, dirName) {
    const params = {
      Bucket: window.env.REACT_APP_S3_BUCKET + dirName,
      Key: fileName
    };
    config.deleteObject(params, function(err, data) {
      if (err) {
        throw err;
      }
      console.log(`File deleted successfully.`);
    });
  }
};

export default S3;

//IMPORTS
const { Storage } = require('@google-cloud/storage');

//STORAGE SPACE
const projectId = 'prospect-222508';// Your Google Cloud Platform project ID
const storage = new Storage({ projectId: projectId }); // Creates a client
const externalLinkBase = "https://storage.googleapis.com/"
const uploadOptions = {
    gzip: true,            // Support for HTTP requests made with `Accept-Encoding: gzip`
    metadata: {
        cacheControl: 'public, max-age=31536000', // Enable long-lived HTTP caching headers
    },
};


module.exports = {
    storeFileInUserBucket: async function (options) {

        let bucketName = options.bucketName;
        let outputPath = options.outputPath;
        let outputName = options.outputName

        const bucket = storage.bucket(bucketName);
        return new Promise(async (resolve, reject) => {
            //UPLOAD
            try {
                await bucket.upload(outputPath, uploadOptions);
            } catch (err) {
                return reject({ success: false, code: "UPLOAD_ERROR", options: options, err: err });
            }

            //MAKE PUBLIC
            try {
                await storage.bucket(bucketName).file(outputName).makePublic();
                return resolve({ success: true, path: externalLinkBase + bucketName + "/" + outputName });
            } catch (err) {
                return reject({ success: false, code: "UPLOAD_ERROR_MAKEPUBLIC", options: options, err: err });
            }
        })
    }
}

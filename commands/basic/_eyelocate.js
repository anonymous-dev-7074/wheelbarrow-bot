const request = require('request-promise-native');

module.exports = {
    name: "_eyelocate",
    category: "basic",
    description: "Serves as a driver module for several commands that require locating the eyes",
    usage: "none",
    async execute(op, callback){

        const subscriptionKey = process.env.subscriptionKey;
        const uriBase = 'https://wheelbarrow.cognitiveservices.azure.com/face/v1.0/detect';

        const params = {
            'returnFaceLandmarks': 'true',
            'recognitionMode': 'detection_02',
            'recognitionModel': 'recognition_02'
        };

        //all we need is to pass options as a parameter to module
        const options = {
            uri: uriBase,
            qs: params,
            body: op,
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };


        request.post(options, async (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.parse(body);

            if (jsonResponse.length == 0) {
                callback(null);
            }
            else {
                callback([jsonResponse[0].faceLandmarks.pupilLeft,
                          jsonResponse[0].faceLandmarks.pupilRight,
                          jsonResponse[0].faceLandmarks.eyeLeftTop,
                          jsonResponse[0].faceLandmarks.eyeLeftBottom,
                          jsonResponse[0].faceLandmarks.eyeRightTop,
                          jsonResponse[0].faceLandmarks.eyeRightBottom]);
            }
        });

        
    }
}
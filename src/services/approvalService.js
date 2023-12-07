
const axios = require('axios');
const serviceObject = require('../services/authService');
const authObject = require('../flowObject/authObject');
const baseUrl = "https://059005-sales-enterprise.creatio.com";

const approvalService = {


    async getApprovalList() {

        authObject.cookie = await serviceObject.getCookie();
        if(authObject.cookie)
        {
          authObject.cookiestring = authObject.cookie.join(';');
          authObject.bpmcsrf = await serviceObject.getBpmcsrfValue(authObject.cookie);
        }
        const url = `${baseUrl}/0/rest/VisaDataService/GetVisaEntities`;
        let requestbody = JSON.stringify({
                "sysAdminUnitId": "7f3b869f-34f3-4f20-ab4d-7480a5fdf647",
                "requestOptions": {
                    "isPageable": true,
                    "rowCount": 16,
                    "ownerRoleSources": 63
                }
          });
        let config = {
            method: 'Post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ForceUseSession': 'true',
                'BPMCSRF': authObject.bpmcsrf,
                'Cookie': authObject.cookiestring
            },
            data : requestbody
        };
        try {
            const response = await axios.request(config);
            if (response.status === 200) {
                return response.data;
            } else {
                console.log(`Request failed with status code: ${response.status}`);
                return 'Failed';
            }
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    }
};

module.exports = approvalService;

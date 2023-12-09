
const axios = require('axios');
const serviceObject = require('../services/authService');
const authObject = require('../flowObject/authObject');
const approvalObject = require('../flowObject/approvalObject');
const baseUrl = "https://059005-sales-enterprise.creatio.com";

const approvalService = {


    async getApprovalList() {
        authObject.cookie = await serviceObject.getCookie();
        if(authObject.cookie === "Authorization Error")
        {
            return "Authorization Error";
        }
        else
        {
          authObject.cookiestring = authObject.cookie.join(';');
          authObject.bpmcsrf = await serviceObject.getBpmcsrfValue(authObject.cookie);
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
                const result = JSON.parse(response.data.GetVisaEntitiesResult);
                const seen = new Set();
                const filteredData = result.rows.filter((obj) => {
                  const key = obj.VisaObjectId;
                  if (seen.has(key)) {
                    return false;
                  }
                  seen.add(key);
                  return true;
                });
                result.rows = filteredData; 
                approvalObject.approvals = result.rows;
                return "Get approvals Succeded";
            } else {
                console.log(`Request failed with status code: ${response.status}`);
                return "Get approvals Failed";
            }
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    }
},
    async getApprovalFields() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseUrl}/0/odata/UsrMSTeamsMappings?$expand=UsrSectionName($select=Code)&$select=UsrSectionNameId,UsrSectionFields`,
            headers: { 
              'BPMCSRF': authObject.bpmcsrf, 
              'Cookie': authObject.cookiestring
            }
        };
        try {
            const response = await axios.request(config);
            if (response.status === 200) {

                approvalObject.approvalfields = response.data.value;
                console.log(approvalObject.approvalfields);
                return "Get approval fields succedded";
            } else {
                console.log(`Request failed with status code: ${response.status}`);
                return "Get approval fields failed";             
            }
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    },

    async GetSelectedApprovalData(SelectedApproval,requestfields) {
        const url = this.ConstructRequestUrl(SelectedApproval,requestfields);
        console.log(url);
        let config = {
            method: 'Get',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ForceUseSession': 'true',
                'BPMCSRF':authObject.bpmcsrf,
                'Cookie': authObject.cookiestring
            }
        };
        try {
            const response = await axios.request(config);
            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            } else {
                console.log(`Request failed with status code: ${response.status}`);
                return 'Failed';
            }
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    },

    ConstructRequestUrl(SelectedApproval) {
            const expandString = approvalObject.selectedapprovalfields
                .filter(field => field.includes('.'))
                .map(field => {
                    const [navigationProperty, nestedField] = field.split('.');
                    return `${navigationProperty}($select=${nestedField})`;
                })
                .join(',');
            const selectString = approvalObject.selectedapprovalfields
                .filter(field => !field.includes('.'))
                .join(',');
            const url = `${baseUrl}/0/odata/${approvalObject.selectedapproval.SchemaName}(${approvalObject.selectedapproval.VisaObjectId})?$expand=${expandString} & $select=${selectString}`;
            return url;
    },

    async initiateUserAction(useraction) {
        const url = `${baseUrl}/0/rest/ApprovalService/${useraction}`;
        let requestbody = JSON.stringify({
            "request": {
              "id": approvalObject.selectedapproval.Id,
              "schemaName": "SysApproval",
              "additionalColumnValues": [
                {
                  "Key": "Comment",
                  "Value": ""
                }
              ]
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
                console.log(response.data);
                return response.data;
            } else {
                console.log(`Request failed with status code: ${response.status}`);
                return 'Failed';
            }
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    },

};

module.exports = approvalService;

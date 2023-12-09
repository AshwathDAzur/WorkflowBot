
const axios = require('axios');
const baseUrl = "https://059005-sales-enterprise.creatio.com";


const authService = {

    async getCookie() {
        const url = `${baseUrl}/ServiceModel/AuthService.svc/Login`;
        const requestBody = JSON.stringify({
            UserName: 'Supervisor',
            UserPassword: 'Supervisor@123',
        });

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'ForceUseSession': true
        };
        try {
            const response = await axios.post(url, requestBody, { headers });
            const responseheaders = response.headers;
           if(response.data.Code == 1)
           {
            console.log(response.data.Message);
            return "Authorization Error";
           }
            const setcookie = responseheaders['set-cookie'];
            return setcookie;
        } catch (error) {
            console.log(error);
            return 'An error occurred during the request.';
        }
    },

    getBpmcsrfValue(cookie){
            let bpmCsrfValue = null;
            for (const cookieValue of cookie) {
                if (cookieValue.startsWith('BPMCSRF=')) {
                    bpmCsrfValue = cookieValue.split('=')[1].split(';')[0];
                    break;
                }
            }
            return bpmCsrfValue;
    }
};

module.exports = authService;

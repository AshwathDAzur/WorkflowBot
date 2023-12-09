const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { AdaptiveCardResponse, InvokeResponseFactory } = require("@microsoft/teamsfx");


const service = require("../services/approvalService");
const approvalObject = require("../flowObject/approvalObject");

//Adaptive Cards Imports
const unAuthorizeCard = require("../adaptiveCards/unauthorizedTaskResponse.json");
const ExceptionCard = require("../adaptiveCards/handleExceptionResponse.json");

//Data imports
const unauthorizedData = require("../data/unauthorizedData.json");
const approvalNotFoundData = require("../data/approvalNotFoundData.json");
const getApprovalsFailedData = require("../data/getApprovalsFailedData.json");

class listApprovalsActionhandler {
  triggerVerb = "listmyapprovals";

  async handleActionInvoked(context, message) {

        const response = await service.getApprovalList();
        if (approvalObject.approvals && approvalObject.approvals.length > 0) 
        {
            const body = approvalObject.approvals.map(App => ({
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Execute",
                        "title": App.Title,
                        "verb": "selectedapproval",
                        "data": {
                            "Id": App.Id,
                            "Title" : App.Title,
                            "SchemaName" : App.SchemaName
                        }
                    }
                ]
            }));
            const responseCard = {
                "type": "AdaptiveCard",
                "body": body,
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.6"
              };
              const responseCardJson = AdaptiveCards.declare(responseCard).render({});
              return InvokeResponseFactory.adaptiveCard(responseCardJson);
        }
        else if(response === "Get approvals Failed")
        {
            const responseCardJson = AdaptiveCards.declare(ExceptionCard).render(getApprovalsFailedData);
            return InvokeResponseFactory.adaptiveCard(responseCardJson);
        }
        else if(response === "Authorization Error")
        {
            const responseCardJson = AdaptiveCards.declare(unAuthorizeCard).render(unauthorizedData);
            return InvokeResponseFactory.adaptiveCard(responseCardJson);
        }
        else
        {
            const responseCardJson = AdaptiveCards.declare(ExceptionCard).render(approvalNotFoundData);
            return InvokeResponseFactory.adaptiveCard(responseCardJson);
        }
  }
}

module.exports = {
    listApprovalsActionhandler,
};
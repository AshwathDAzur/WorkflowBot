const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { AdaptiveCardResponse, InvokeResponseFactory } = require("@microsoft/teamsfx");
const service = require('../services/approvalService');
var Approvals = "";

class listApprovalsActionhandler {
  triggerVerb = "listmyapprovals";

  async handleActionInvoked(context, message) {

        const response = await service.getApprovalList();
        const result = JSON.parse(response.GetVisaEntitiesResult);
        Approvals = result.rows;
        if (Approvals && Approvals.length > 0) 
        {
            const body = Approvals.map(App => ({
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Execute",
                        "title": App.Title,
                        "data": App.Title
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
        else
        {
            console.log("No Approvals Found");
        }
  }
}

module.exports = {
    listApprovalsActionhandler,
};
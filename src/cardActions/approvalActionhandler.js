const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { AdaptiveCardResponse, InvokeResponseFactory } = require("@microsoft/teamsfx");

const service = require("../services/approvalService");

class approvalActionhandler {
  triggerVerb = "doaction";

  async handleActionInvoked(context, message) {
    var AppStatus = "";
    if(message.action === "Reject") {
        const response = await service.initiateUserAction(message.action);
         if(response.RejectResult)
         {
            AppStatus = "Approval Rejected Successfully";
         }
         else
         {
            AppStatus = "Approval Rejection Failed";
         }
         console.log(response);
    }
    else if(message.action === "Approve") {
         const response = await service.initiateUserAction(message.action);
         if(response.ApproveResult)
         {
            AppStatus = "Approved Successfully";
         }
         else
         {
            AppStatus = "Approval Failed";
         }
         console.log(response);
    }
    else {
        AppStatus = "Task Aborted";
    }
    const responseCard = {
        "type": "AdaptiveCard",
        "body": [
            {
              "type": "Container",
              "items": [
                {
                  "type": "TextBlock",
                  "text": `**Approval Status**`,
                  "weight": "bolder",
                  "size": "medium"
                }
              ]
            },
            {
              "type": "Container",
              "items": [
                {
                  "type": "Container",
                  "items": [
                    {
                      "type": "TextBlock",
                      "text": `**${AppStatus}**`,
                      "wrap": true
                    }
                  ]
                }
              ]
            }
          ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.6"
      };
      const responseCardJson = AdaptiveCards.declare(responseCard).render({});
      return InvokeResponseFactory.adaptiveCard(responseCardJson);
  }
}

module.exports = {
    approvalActionhandler,
};
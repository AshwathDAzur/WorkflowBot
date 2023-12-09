const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { AdaptiveCardResponse, InvokeResponseFactory } = require("@microsoft/teamsfx");


const service = require("../services/approvalService");
const approvalObject = require("../flowObject/approvalObject");

class displaySelectedApprovalhandler {
  triggerVerb = "selectedapproval";

  async handleActionInvoked(context, message) {
    approvalObject.approvals.forEach(Approval => {
        if(Approval.Id == message.Id)
        {
           approvalObject.selectedapproval = Approval;
        }
    });
    const fieldResponse = await service.getApprovalFields();
    if(fieldResponse === "Get approval fields succedded")
    {
        approvalObject.selectedapprovalfields = this.GetRespectiveRequestFields();
        approvalObject.selectedapprovalinfo = await service.GetSelectedApprovalData();
        const displaycard = this.CreateApprovalActionCard();
        const responseCardJson = AdaptiveCards.declare(displaycard).render({});
        return InvokeResponseFactory.adaptiveCard(responseCardJson);
    }
    else
    {
        console.log(fieldResponse);
    }
  }

  GetRespectiveRequestFields() {
    let fields = null; 
    approvalObject.approvalfields.forEach(App => {
        if (App.UsrSectionName.Code === approvalObject.selectedapproval.SchemaName || true) {
            fields = App.UsrSectionFields.split('/');
        }
    });
    return fields;
}
 
 CreateApprovalActionCard() {
    const CreatedDate = approvalObject.selectedapproval.CreatedOn.split('T')[0];
    // const DueDate = SelectedApprovalInfo.DueDate.split('T')[0];
    const facts = approvalObject.selectedapprovalfields.map(field => {
        const [propertyName, subPropertyName] = field.split('.'); 
        const title = `${propertyName}:`;
        const value = `${subPropertyName ? approvalObject.selectedapprovalinfo[propertyName][subPropertyName] : approvalObject.selectedapprovalinfo[propertyName]}`;
        return { title, value };
    });
    console.log(facts);

    const adaptiveCard = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.5",
        "body": [
          {
            "type": "Container",
            "items": [
              {
                "type": "TextBlock",
                "text": `**${approvalObject.selectedapproval.Objective}**`,
                "weight": "bolder",
                "size": "medium"
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "auto",
                    "items": [
                      {
                        "type": "Image",
                        "url": "https://yt3.googleusercontent.com/ytc/APkrFKZgACbg3OJRRbl57caawHXmEgr0x03BoW1XMZJudg=s900-c-k-c0x00ffffff-no-rj",
                        "altText": "Creatio",
                        "size": "small",
                        "style": "person"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": `${approvalObject.selectedapproval.Title}`,
                        "weight": "bolder",
                        "wrap": true
                      },
                      {
                        "type": "TextBlock",
                        "spacing": "none",
                        "text": `Approval date : ${CreatedDate}`,
                        "isSubtle": true,
                        "wrap": true
                      }
                    ]
                  }
                ]
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
                    "text": `**${approvalObject.selectedapproval.SchemaName} Details**`,
                    "wrap": true
                  },
                  {
                    "type": "FactSet",
                    "facts": facts
                  }
                ]
              }
            ]
          }
        ],
        "actions": [
          {
            "type": "Action.Execute",
            "title": "Approve",
            "style": "positive",
            "verb": "doaction",
            "data": {
                "action": "Approve"
            }       
          },
          {
            "type": "Action.ShowCard",
            "title": "Reject",
            "style": "destructive",
            "card": {
              "type": "AdaptiveCard",
              "body": [
                {
                  "type": "Input.Text",
                  "id": "comment",
                  "isMultiline": true,
                  "placeholder": "Are you sure you want to reject the approval?"
                }
              ],
              "actions": [
                {
                  "type": "Action.Execute",
                  "title": "Reject",
                  "verb": "doaction",
                  "data": {
                    "action": "Reject",
                  }
                },
                {
                  "type": "Action.Execute",
                  "title": "Cancel",
                  "verb": "doaction",
                  "data": {
                    "action": "cancel"
                  }
                }
              ]
            }
          }
        ]
      };
    return adaptiveCard;
}

}

module.exports = {
    displaySelectedApprovalhandler,
};
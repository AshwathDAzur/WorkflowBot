const { BotBuilderCloudAdapter } = require("@microsoft/teamsfx");
const ConversationBot = BotBuilderCloudAdapter.ConversationBot;


// import handler
const { listApprovalsActionhandler } = require("../cardActions/listApprovalsActionhandler");
const { greetCommandHandler } = require("../commands/greetCommandHandler");
const { displaySelectedApprovalhandler } = require("../cardActions/displaySelectedApprovalhandler");
const { approvalActionhandler } = require("../cardActions/approvalActionhandler");



const config = require("./config");

// Create the conversation bot and register the command and card action handlers for your app.
const workflowApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  command: {
    enabled: true,
    commands: [
        new greetCommandHandler()
    ],
  },
  cardAction: {
    enabled: true,
    actions: [
      new listApprovalsActionhandler(),
      new displaySelectedApprovalhandler(),
      new approvalActionhandler()
    ],
  },
});

module.exports = {
  workflowApp,
};

const creatioGreetCard = require("../adaptiveCards/creatioTaskResponse.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");

class greetCommandHandler {
  triggerPatterns = "Hai Bot";

  async handleCommandReceived(context, message) {
    console.log(`Bot received message: ${message.text}`);
    const cardJson = AdaptiveCards.declare(creatioGreetCard).render({});
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
 greetCommandHandler,
};

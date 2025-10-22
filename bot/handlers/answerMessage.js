const userState = require('../otherFeature/userState')

module.exports = (bot, pool) => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    try{
      // if

    } catch (error){
      console.error('Произошла ошибка в файле answerMessage.js:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при отправке сообщения.')
    }

  })
}
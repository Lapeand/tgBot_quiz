const isAdmin = require('../otherFeature/admin')
const userState = require('../otherFeature/userState')

module.exports = (bot) => {
  bot.onText(/\/cancel/, (msg) => {
    try{
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      if (isAdmin(userId)){
        bot.sendMessage(chatId, "Вы отменили текущее действие")
        delete userState[userId];
        return
      } else{
        bot.sendMessage(chatId, "У вас не достаточно прав для использования этой команды.")
      }
    }catch (error){
      console.error("Произошла ошибка в файле cancel.js: ", error)
      bot.sendMessage(chatId, "Произошла при написании /cancel: ")
    }
  })
}
const isAdmin = require('../otherFeature/admin');
const userState = require('../otherFeature/userState');

module.exports = (bot, pool) => {
  bot.onText(/\/remove_question/, async (msg) =>{
    try{
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      if (isAdmin(userId)){
        bot.sendMessage(chatId, 'Введите ID вопроса, которые хотите удалить:\n\nДля отмены удаления вопроса введите /cancel')
        userState[userId]= 'awaiting_remove_question';

      }else{
        return bot.sendMessage(chatId, 'У вас не достаточно прав для использования этой команды.');
      }
    } catch (error){
      console.log('Ошибка в файле remove_question.js:', error);
      return bot.sendMessage(chatId, 'Произошла ошибка при вводе команды /remove_question.');
    }
  })
}
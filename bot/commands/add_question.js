const isAdmin = require('../otherFeature/admin');
const userState = require('../otherFeature/userState');

module.exports = (bot, pool) => {
  bot.onText(/\/add_question/, async (msg) =>{
    try{
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      if (isAdmin(userId)){
        bot.sendMessage(chatId, 'Введите вопрос в формате:\nВопрос?; Вариант1; Вариант2; Вариант3; Вариант4; Правильный вариант ответа;\n\nПример:\nСтолица России?; Тюмень; Краснодар; Москва; Ноябрьск; Москва;');
        userState[userId] = 'awaiting_question';

      }else{
        return bot.sendMessage(chatId, 'У вас не достаточно прав для использования этой команды.');
      }
    } catch (error){
      console.log('Ошибка в файле /add_question:', error);
      return bot.sendMessage(chatId, 'Произошла ошибка при вводе команды /add_question.');
    }
  })
}
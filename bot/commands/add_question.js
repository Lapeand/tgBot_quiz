const isAdmin = require('../otherFeature/admin');
const userState = require('../otherFeature/userState');

module.exports = (bot) => {
  bot.onText(/\/add_question/, (msg) =>{
    try{
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      if (isAdmin(userId)){
        bot.sendMessage(chatId, '<b>Введите вопрос в формате:</b>\nВопрос?;\nВариант1; Вариант2; Вариант3; Вариант4\nПравильный вариант ответа\n\n<b>Пример:</b>\nСтолица России?; Тюмень; Краснодар; Москва; Ноябрьск; Москва;\n\n<b>Справка:</b>\n1)Между каждым параметром должен стоять символ ";"\n2)Записать надо все в одной строке\n\nДля отмены создания вопроса введите /cancel', { parse_mode: 'HTML' });
        userState[userId] = {state: 'awaiting_question'};

      }else{
        return bot.sendMessage(chatId, 'У вас не достаточно прав для использования этой команды.');
      }
    } catch (error){
      console.log('Ошибка в файле add_question.js:', error);
      return bot.sendMessage(chatId, 'Произошла ошибка при вводе команды /add_question.');
    }
  })
}


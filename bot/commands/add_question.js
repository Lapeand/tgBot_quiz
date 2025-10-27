const isAdmin = require('../otherFeature/admin');
const userState = require('../otherFeature/userState');

module.exports = (bot, pool) => {
  bot.onText(/\/add_question/, async (msg) =>{
    try{
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      // Проверка регистрации
      const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
      if (userCheck.rows.length === 0){
        return bot.sendMessage(chatId, '❗Вам нужно зарегистрироваться! Введите /start❗')
      }

      //Проверка на админа
      if(!isAdmin(userId)){
        return bot.sendMessage(chatId, '❗У вас не достаточно прав для использования этой команды.❗');
      }

      //обработка команды
      bot.sendMessage(chatId, '<b>Введите вопрос в формате:</b>\nВопрос?;\nВариант1; Вариант2; Вариант3; Вариант4\nПравильный вариант ответа\n\n<b>Пример:</b>\nСтолица России?; Тюмень; Краснодар; Москва; Ноябрьск; Москва;\n\n<b>Справка:</b>\n1)Между каждым параметром должен стоять символ ";"\n2)Записать надо все в одной строке\n\nДля отмены создания вопроса введите /cancel', { parse_mode: 'HTML' });
      userState[userId] = {state: 'awaiting_question'};

    } catch (error){
      console.log('Ошибка в файле add_question.js:', error);
      return bot.sendMessage(chatId, '❗Произошла ошибка при вводе команды /add_question.❗');
    }
  })
}


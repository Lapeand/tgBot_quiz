const isAdmin = require('../otherFeature/admin')
const userState = require('../otherFeature/userState')

module.exports = (bot, pool) => {
  bot.onText(/\/cancel/, async (msg) => {
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
      delete userState[userId];
      return bot.sendMessage(chatId, "Вы отменили текущее действие")

    }catch (error){
      console.error("Произошла ошибка в файле cancel.js: ", error)
      bot.sendMessage(chatId, "❗Произошла при вводе /cancel.❗")
    }
  })
}
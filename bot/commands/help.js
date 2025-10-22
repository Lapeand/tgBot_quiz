module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpText = `
<b>Команды бота:</b>\n
/start - Регистрация
/help - Справка как пользоваться ботом
/quiz - Начать викторину
/stats - Показать статистику по чат-боту
/top - показать топ-10 пользователей по очкам\n
<b>Команды для админа:</b>\n
/add_question - Добавить вопрос
/remove_question - Удалить вопрос
    `;

    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  });
};
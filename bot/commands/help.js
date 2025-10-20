module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpText = `
<b>Команды бота:</b>\n
/start - Регистрация
/help - Справка как пользоваться ботом
/quiz - Начать викторину



    `;

    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  });
};
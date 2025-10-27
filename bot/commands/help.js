module.exports = (bot) => {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpText = `<b>Команды бота:</b>\n` +
            `/start - Регистрация\n` +
            `/help - Справка как пользоваться ботом\n` +
            `/quiz - Начать викторину\n` +
            `/top - показать топ-10 пользователей по очкам\n\n`+
            `<b>Команды для админа:</b>\n`+
            `/add_question - Добавить вопрос\n` +
            `/remove_question - Удалить вопрос`;

    bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
  });
};
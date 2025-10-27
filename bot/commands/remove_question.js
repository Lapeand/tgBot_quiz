const isAdmin = require('../otherFeature/admin');
const userState = require('../otherFeature/userState');

module.exports = (bot, pool) => {
  bot.onText(/\/remove_question/, async (msg) =>{
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

      //Обработка команды
      //Получения всех вопросов
      const result = await pool.query(`SELECT id, question_text FROM questions ORDER BY id`)
      const questions = result.rows;

      //если база данныъ пустая
      if (questions.lenght === 0){
        return bot.sendMessage(chatId, 'В базе данных вопросов нету');
      }

      for(const question of questions){
        const text = `ID вопроса: ${question.id}\nТекст вопроса: ${question.question_text}`;
        const options = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Удалить вопрос',
                  callback_data: `remove_question_${question.id}`
                }
              ]
            ]
          }
        }
        await bot.sendMessage(chatId, text, options);
      }

    } catch (error){
      console.log('Ошибка в файле remove_question.js:', error);
      return bot.sendMessage(chatId, '❗Произошла ошибка при вводе команды /remove_question.❗');
    }
  })
}
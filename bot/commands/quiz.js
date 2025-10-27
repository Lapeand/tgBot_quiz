module.exports = (bot, pool) => {
  bot.onText(/\/quiz/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Проверка регистрации
    const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    if (userCheck.rows.length === 0){
      return bot.sendMessage(chatId, '❗Вам нужно зарегистрироваться! Введите /start❗')
    }

    //Обработка команды
    getQuestion(bot, pool, chatId, userId);
    
  });
}

async function getQuestion(bot, pool, chatId, userId){
      try{
        // Получения вопроса, на которые у пользоватля нет ответа.
        const request = await pool.query(`
          SELECT question_text, options, answer 
          FROM questions 
          WHERE id NOT IN 
          (SELECT question_id 
          FROM user_answers 
          WHERE user_id = $1) 
          ORDER BY RANDOM() 
          LIMIT 1`, [userId]);

        // Если вопросов больше нет
        if (request.rows.length === 0 ){
          return bot.sendMessage(chatId, 'Вы ответили на все вопросы!');
        }

        const question = request.rows[0];

        // Текст вопроса
        const questionText = question.question_text;

        // Кнопки с вариантами ответов
        const options = question.options;
        const optionsButtons = {
          reply_markup: {
            inline_keyboard: options.map((option, index) => [
              {
                text: option,
                callback_data: `button_${index + 1}`
              }
          ])
          }
        }

        bot.sendMessage(chatId, questionText, optionsButtons);

      } catch (error){
        console.log('Произошла ошибка в файле quiz.js: ', error);
        return bot.sendMessage(chatId, '❗Произошла ошибка при получении вопроса. Попробуйте еще раз.❗');
      }
    }

module.exports.getQuestion = getQuestion;
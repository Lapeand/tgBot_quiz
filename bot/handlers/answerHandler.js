const {getQuestion} = require('../commands/quiz')

module.exports = (bot, pool) =>  {
  bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const userId = callbackQuery.from.id;

    if (data.startsWith('button_')){
      const selectedOptionIndex = parseInt(callbackQuery.data.replace('button_', ''), 10) - 1;

      try{
        const questionText = msg.text;
        const questionMass = await pool.query(`SELECT * FROM questions WHERE question_text=$1`, [questionText]);
        

        if (questionMass.rows.length === 0){
          return bot.sendMessage(chatId, 'Произошла ошибка. Вопрос не был найден.');
        }

        const question = questionMass.rows[0];

        //проверка если пользователь уже ответил на этот вопрос
        const alreadyAnswered = await pool.query(`SELECT user_id, question_id FROM user_answers WHERE user_id=$1 AND question_id=$2`, [userId, question.id, ])
        if (alreadyAnswered.rows.length >0){
          return bot.sendMessage(chatId, 'Вы уже ответили на этот вопрос!');
        }

        // Получение вариантов ответа и правильного ответа и занесении их в таблицу user_answers
        const options = question.options;
        const correctAnswer = question.answer;
        const chosenOption = options[selectedOptionIndex]; // Выбранный пользователем вариант ответа
        const checkCorrect = options[selectedOptionIndex] === correctAnswer // Проверка правильности ответа

        await pool.query(`INSERT INTO user_answers (user_id, question_id, chosen_option, correct) VALUES ($1, $2, $3, $4)`, [userId, question.id, chosenOption, checkCorrect]);

        // Обновление счета пользователя, если ответ правильный вызов функции для продолжения или завершения викторины
        if (checkCorrect){
          await pool.query(`UPDATE users SET score = score + 1 WHERE id=$1`, [userId]);
          bot.sendMessage(chatId, 'Правильный ответ!');
          sendContinueOptions(bot, chatId)
        } else{
          bot.sendMessage(chatId, 'Неправильный ответ!');
          sendContinueOptions(bot, chatId)
        }
      } catch (error){
        console.log('Произошла ошибка в файле answerHandler.js: ', error);
        return bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего ответа.');
      }
    }

    // обработка продолжения и заверешния викторины
    else if (data.startsWith('quiz_')){
      if (callbackQuery.data === 'quiz_continue'){
        getQuestion(bot, pool, chatId, userId);
      }
      if (callbackQuery.data === 'quiz_end'){
        return bot.sendMessage(chatId, 'Викторина завершена.')
      }
  }
  })
}

// Функция для получения следующего вопроса или завершения викторины
function sendContinueOptions(bot, chatId){
  const continueOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Следующий вопрос',
            callback_data: 'quiz_continue'
          }
        ],
        [
          {
            text: 'Завершить викторину',
            callback_data: 'quiz_end'
          }
        ]
      ]
  }}
  bot.sendMessage(chatId, 'Хотите продолжить?', continueOptions);
}


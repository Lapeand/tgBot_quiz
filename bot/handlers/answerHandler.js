const { getQuestion } = require('../commands/quiz')
const userState = require('../otherFeature/userState')
const isAdmin = require('../otherFeature/admin')

module.exports = (bot, pool) =>  {
  bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const userId = callbackQuery.from.id;



    //реагирование на кнопки которые начинаются на button_
    if (data.startsWith('button_')){
      const selectedOptionIndex = parseInt(callbackQuery.data.replace('button_', ''), 10) - 1;

      try{
        const questionText = msg.text;
        const questionMass = await pool.query(`SELECT * FROM questions WHERE question_text=$1`, [questionText]);
        

        if (questionMass.rows.length === 0){
          return bot.sendMessage(chatId, '❗Произошла ошибка. Вопрос не был найден.❗');
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
          bot.sendMessage(chatId, '✅Правильный ответ!✅');
          sendContinueOptions(bot, chatId)
        } else{
          bot.sendMessage(chatId, 'Неправильный ответ!');
          sendContinueOptions(bot, chatId)
        }
      } catch (error){
        console.log('Произошла ошибка в файле answerHandler.js: ', error);
        return bot.sendMessage(chatId, '❗Произошла ошибка при обработке вашего ответа.❗');
      }
    }



    // обработка продолжения и заверешния викторины
    else if (data.startsWith('quiz_')){
      if (callbackQuery.data === 'quiz_continue'){
        return getQuestion(bot, pool, chatId, userId);
      }
      if (callbackQuery.data === 'quiz_end'){
        return bot.sendMessage(chatId, 'Викторина завершена.')
      }

    }



    // обработка кнопок добавления/ отмены создание вопроса.
    else if (data.startsWith('add')){  
      try{
        if (callbackQuery.data === 'add_question_confirm' && userState[userId] && userState[userId].state === 'awaiting_confirmation'){
        //инициализурю параметры вопроса и добавляю вопрос в таблицу
        const { question, options, correctAnswer } = userState[userId];
        await pool.query('INSERT INTO questions (question_text, options, answer) VALUES ($1, $2, $3)', [question, JSON.stringify(options), correctAnswer]);

        //после добавления вопроса нужно очитсить userState
        delete userState[userId];
        return bot.sendMessage(chatId, '✅Вопрос успешно добавлен!✅');
        }

        if (callbackQuery.data === 'add_question_cancel' && userState[userId] && userState[userId].state === 'awaiting_confirmation'){
          delete userState[userId];
          return bot.sendMessage(chatId, 'Вы отменили создание вопроса. Чтоба начать заново создавать вопрос введите /add_question');
        }
        return bot.answerCallbackQuery(callbackQuery.id, { 
          text: '❗Эта кнопка больше недоступна❗' 
        });

      }catch (error){
        console.error('Произошла ошибка при создании вопроса в файле answerHandler.js: ', error);
        bot.sendMessage(chatId, '❗Произошла ошибка при создании вопроса.❗')
      }
    }


    // обработка кнопок удаления вопросов
    else if (data.startsWith('remove_question_')){
      // Проверка на админа
      if(!isAdmin(userId)){
        return bot.sendMessage(chatId, '❗У вас не достаточно прав для использования этой команды.❗');
      }

      const questionId = parseInt(data.replace('remove_question_', ''), 10);
    
      try{
        const checkQuestion = await pool.query(`SELECT id FROM questions WHERE id=$1`, [questionId])

        //Проверка существует литакой вопрос
        if (checkQuestion.rows.length===  0){
          return bot.sendMessage(chatId, '❗Вопрос не найден или уже удален❗');
        }

        //удаление вопроса и вариантов ответа(иначе будет ошибка, если не удалить варианты ответа)
        await pool.query(`DELETE FROM user_answers WHERE question_id=$1`, [questionId])
        await pool.query(`DELETE FROM questions WHERE id=$1`, [questionId]);
        return bot.sendMessage(chatId, '✅ Вопрос был успешно удален ✅');

      } catch (error){
        console.error('Произошлка ошибка в файле answerhandler.js в блоке remove_question_:', error);
        bot.sendMessage(chatId, '❗Произошлка ошибка при удалении вопроса.❗');
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


const isAdmin = require('../otherFeature/admin')
const userState = require('../otherFeature/userState')

module.exports = (bot, pool) => {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const inputText = msg.text;
    
    try{
      // Чтобы не реагировал на команды
      if (inputText.startsWith('/')){
        return;
      }

      // создание вопроса
      if (isAdmin(userId) && userState[userId] && userState[userId].state === 'awaiting_question'){
        const parts = inputText.split(';').map(p => p.trim()).filter(p => p !== '');
        if (parts.length!==6){
          return bot.sendMessage(chatId, '❗Неверный формат написания вопроса.❗\nДолжно быть: Вопрос + 4 варианта ответа + правильный ответ.\nКаждый параметр необходимо отделять знаком ";"\n\nПопробуйте снова или отмените действие с помощью команды /cancel');
        }

        const [question, option1, option2, option3, option4, correctAnswer] = parts;

        // Меняем статус перед подтверждения/отмены создания вопроса и добавляем параметры вопроса
        userState[userId] = {
          state: 'awaiting_confirmation',
          question: question,
          options: [option1, option2, option3, option4],
          correctAnswer: correctAnswer
        }

        // создание кнопок для подтверждения/отмены создания вопроса
        const confirmationAddQuestionOptions = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Подтвердить создание вопроса',
                    callback_data: 'add_question_confirm'
                  }
                ],
                [
                  {
                    text: 'Отменить создание вопроса',
                    callback_data: 'add_question_cancel'
                  }
                ]
              ]
          }}
          bot.sendMessage(chatId, `Ваш вопрос: ${question}\nВаши варианты ответа: ${option1}, ${option2}, ${option3}, ${option4}\nПравильный вариант ответа: ${correctAnswer}\n\nНажмите на кнопку:`, confirmationAddQuestionOptions);
      }

      else if(isAdmin(userId) && userState[userId] && userState[userId].state === 'awaiting_remove_question'){
        



      }else{
        return bot.sendMessage(chatId, 'Я не понимаю вас. Воспользуйтесь командой /help для получения списка доступных команд.');
      }
      

    } catch (error){
      console.error('Произошла ошибка в файле answerMessage.js:', error);
      bot.sendMessage(chatId, '❗Произошла ошибка при отправке сообщения.❗')
    }

  })
}
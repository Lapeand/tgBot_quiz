module.exports = (bot, pool) =>{
  bot.onText(/\/top/, async (msg) =>{
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try{
      // Проверка регистрации
      const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
      if (userCheck.rows.length === 0){
        return bot.sendMessage(chatId, '❗Вам нужно зарегистрироваться! Введите /start❗')
      }

      // обработка команды
      //Получаем топ
      const topResult = await pool.query(`SELECT username, score FROM users ORDER BY score DESC LIMIT 5`)
      const usersTop = topResult.rows;

      //Получаем свое кол-во очков и место
      const userScore = userCheck.rows[0].score;
      const rankResult = await pool.query(`
        SELECT rank FROM (
          SELECT id, username, score,
                DENSE_RANK() OVER (ORDER BY score DESC) AS rank
          FROM users
        ) ranked
        WHERE id = $1
      `, [userId]);

      const userRank = rankResult.rows[0].rank;
        

      // список медалей
      const medals = ['🥇', '🥈', '🥉', '🏅', '🎖️']

      //Собираем сообщение
      let text = '🏆 ТОП-5 ПО ОЧКАМ 🏆\n\n'
      usersTop.forEach((user, index) => {
        text+= `${medals[index]} ${index+1}. ${user.username} - ${user.score} ⭐\n`
      })
      text+= `\nВаша позиция #${userRank} - ${userScore}⭐`
      
      bot.sendMessage(chatId, text);

      }catch (error){
        console.error('Произошла ошибка в файле top.js:', error);
        bot.sendMessage(chatId, '❗Произошла ошибка при вводе команды /top.❗')
      }

  })
}
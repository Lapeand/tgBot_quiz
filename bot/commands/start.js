module.exports = (bot, pool) => {
  bot.onText(/\/start/, async (msg) =>{
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.firstname || 'Unknown';

    try{
      const result = await pool.query('SELECT * FROM users WHERE id=$1', [userId]);

      if (result.rows.length === 0){
        // Если пользователь нет, создание новой записи
        await pool.query('INSERT INTO users (id, username) VALUES ($1, $2)', [userId, username]);
        bot.sendMessage(chatId, `Привет, ${username}! ✅Ты успешно зарегистрировался(ась)!✅`)

      } else{ 
        // Если пользователь обновил свое имя
        const oldUsername = result.rows[0].username;
        if (oldUsername !== username){
          await pool.query('UPDATE users SET username=$1 WHERE id=$2', [username, userId]);
        }
        bot.sendMessage(chatId, `С возвращением, ${username}!`)
      }
      
    } catch(error){
      console.error('Ошибка при вводе команды start.js: ', error);
      bot.sendMessage(chatId, '❗Произошла ошибка при регистрации. Попробуйте еще раз.❗')
    }
  })
}
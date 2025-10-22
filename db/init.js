const {pool} = require('./pool')


async function initDatabase() {
  let client;

  try{

    //Подключение к базе данных
    client = await pool.connect();
    console.log('Клиент подключен к базе данных')


    // Создание таблиц
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY,
      username TEXT,
      score INT DEFAULT 0
    );
      `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,  
      question_text TEXT NOT NULL,
      options JSON NOT NULL,
      answer TEXT NOT NULL
    );
      `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_answers (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id),
      question_id INT REFERENCES questions(id),
      chosen_option TEXT,
      correct BOOLEAN,
      answered_at TIMESTAMP DEFAULT NOW()
    );
      `)

  } catch(error){
    console.error('Произошла ошибка инициализации баз даннах: ', error)
  } finally{
    await client.release();
    console.log('Клиент возвращен')
  }
}
module.exports = initDatabase;
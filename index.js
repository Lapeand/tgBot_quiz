require('dotenv').config();
const {pool, pingDatabase} = require('./db/pool');
const initDatabase = require('./db/init');

const TelegramBot = require('node-telegram-bot-api');


async function startBot() {
  try{
    //Проверяю подключение к базе данных
    await pingDatabase();

    // Заранее инициализрую базу данных
    await initDatabase();
    console.log('База данных успешно инициализирована');

    // Создание бота
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true});

    //Импортирую команды
    require('./bot/commands/start')(bot, pool);
    require('./bot/commands/help')(bot);
    require('./bot/commands/quiz')(bot, pool);
    
    //Импортирую обработчики
    require('./bot/handlers/answerHandler')(bot, pool);
    
    
    // Другие фичи/вспомогательные темки
    require('./bot/otherFeature/admin'); // возможно добавить
    require('./bot/otherFeature/userState'); // возможно добавить
    
    //Сообщение о запуске
    console.log('Бот запущен...');

  } catch(error){
    console.error('Ошибка при инициализации базы данных:', error);
  }
}

startBot();

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

    // Создание бота
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true});

    //Импортирую команды для пользователей
    require('./bot/commands/start')(bot, pool);
    require('./bot/commands/help')(bot);
    require('./bot/commands/quiz')(bot, pool);
    require('./bot/commands/top')(bot, pool);

    //Импортирую команды для админа
    require('./bot/commands/add_question')(bot, pool);
    require('./bot/commands/remove_question')(bot, pool);
    require('./bot/commands/cancel')(bot, pool);
    
    //Импортирую обработчики
    require('./bot/handlers/answerHandler')(bot, pool);
    require('./bot/handlers/answerMessage')(bot, pool);
    
    //Импортирую другие фичи/вспомогательные вещи
    require('./bot/otherFeature/admin');
    require('./bot/otherFeature/userState');
    
    //Сообщение о запуске
    console.log('Бот запущен...');

  } catch(error){
    console.error('Ошибка при инициализации бота в файле index.js:', error);
  }
}

startBot();

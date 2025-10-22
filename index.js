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

    //Импортирую команды для пользователей
    require('./bot/commands/start')(bot, pool);
    require('./bot/commands/help')(bot);
    require('./bot/commands/quiz')(bot, pool);

    //Импортирую команды для админа
    require('./bot/commands/add_question')(bot);
    require('./bot/commands/cancel')(bot);
    
    //Импортирую обработчики
    require('./bot/handlers/answerHandler')(bot, pool);
    require('./bot/handlers/answerMessage')(bot, pool);
    
    //Импортирую другие фичи/вспомогательные вещи
    require('./bot/otherFeature/admin'); //потом проверить надо ли добавить (bot)
    require('./bot/otherFeature/userState'); //потом проверить надо ли добавить (bot)
    
    //Сообщение о запуске
    console.log('Бот запущен...');

  } catch(error){
    console.error('Ошибка при инициализации базы данных:', error);
  }
}

startBot();

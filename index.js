const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token, {polling: true});
const schedule = require('node-schedule');


const j = schedule.scheduleJob(config.time, function() {
    config.userIds.forEach(id => {
        bot.sendMessage(id, 'Не забудь отметить время в таблице');
    })
});
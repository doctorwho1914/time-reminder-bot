const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token, {polling: true});
const schedule = require('node-schedule');
const moment = require('moment');


const j = schedule.scheduleJob(config.time, function() {
    config.userIds.forEach(id => {
        bot.sendMessage(id, 'Не забудь отметить время в таблице');
    })
});

bot.onText(/напомни в (.+)/, (msg, match) => {
    try {
        let userId = msg.from.id;

        let matchSplited = match[1].split(' ');
        let date = moment(matchSplited[0] + ' ' + matchSplited[1], 'HH:mm DD.MM.YYYY');
        let text = match[1].substring(17, match[1].length);

        if (date.format('X') - moment().format('X') < 0) {
            bot.sendMessage(userId, 'Эй! Парень, ты бы указал дату в будущем! -_-');
            return false;
        }

        if (date.format('X') - moment().format('X') > 157852800) {
            bot.sendMessage(userId, 'Я не могу запомнить больше чем на 5 лет. Прости...');
            return false;
        }


        bot.sendMessage(userId, 'Слушаюсь господин');

        const j1 = schedule.scheduleJob(date.toDate(), () => {
            bot.sendMessage(userId, 'Напомнимаю =)');
            bot.sendMessage(userId, text);
            j1.cancel();
        });

    } catch (e) {
        errorMessage(e, msg.from.id);
    }


});

bot.onText(/\/help/, (msg) => {
    try {
        let userId = msg.from.id;

        bot.sendMessage(userId, 'Просто отправь мне сообщение на подобии этого');
        bot.sendMessage(userId, 'напомни в 02:46 28.07.2019 приготовить курицу');

    } catch (e) {
        errorMessage(e, msg.from.id);
    }
});

function errorMessage(e, userId) {
    console.log(e);
    bot.sendMessage(userId, 'Ошибка, сударь');
}
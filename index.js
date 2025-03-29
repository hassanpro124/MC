const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
    host: 'Pyrolegion.aternos.me', // Aternos server IP
    port: 47330, // Server port
    username: 'NOOB', // Bot's name
    version: '1.20.1' // Match your server version
});

bot.once('spawn', () => {
    console.log('AFK bot is online!');
    bot.chat('/login Noob123'); // 🚨 Your password is here!

    bot.loadPlugin(pathfinder);
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements);

    // 🛑 STOP Breaking Beds & Other Blocks
    bot.on('blockBreakProgressObserved', (block) => {
        if (block && block.name !== 'dirt') { 
            bot.chat("I can only break dirt! 🛑");
            bot.clearControlStates(); // Stop breaking
        }
    });

    // 🛏️ Make bot sleep at night
    function sleepAtNight() {
        if (bot.time.isNight && !bot.isSleeping) {
            const bed = bot.findBlock({
                matching: (block) => block.name.includes('bed'),
                maxDistance: 10
            });

            if (bed) {
                bot.chat("It's night! Going to bed... 🛏️");
                bot.pathfinder.setGoal(new goals.GoalBlock(bed.position.x, bed.position.y, bed.position.z));

                setTimeout(() => {
                    bot.sleep(bed)
                        .then(() => bot.chat("Zzz... 😴"))
                        .catch(() => bot.chat("I can't sleep!"));
                }, 5000);
            } else {
                bot.chat("No bed found nearby! 😢");
            }
        }
    }

    // ☀️ Wake up in the morning
    function wakeUp() {
        if (bot.isSleeping && !bot.time.isNight) {
            bot.wake()
                .then(() => bot.chat("Good morning! ☀️"))
                .catch(() => bot.chat("I can't wake up!"));
        }
    }

    setInterval(sleepAtNight, 10000); // Check every 10 sec
    setInterval(wakeUp, 10000); // Wake up check

    function randomWalk() {
        const x = bot.entity.position.x + (Math.random() * 20 - 10);
        const z = bot.entity.position.z + (Math.random() * 20 - 10);
        const goal = new goals.GoalBlock(Math.floor(x), bot.entity.position.y, Math.floor(z));

        bot.pathfinder.setGoal(goal);
    }

    setInterval(randomWalk, 5000); // Move every 5 sec
});

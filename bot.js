function makeRoll(diceSize) {//only int
    var roll = 0;
    //    if (dice.substr(1, 3) == "100") { //d100
    //        roll += Math.floor(Math.random() * Math.floor(100));
    //    } 
    //    else if (dice.substr(1, 2) == "20") { //d20
    //        roll += Math.floor(Math.random() * Math.floor(20));
    //    } 
    //    else if (dice.substr(1, 2) == "10") { //d10
    //        roll += Math.floor(Math.random() * Math.floor(10));
    //    } 
    //    else if (dice.substr(1, 1) == "8") { //d8
    //        roll += Math.floor(Math.random() * Math.floor(8));
    //    } 
    //    else if (dice.substr(1, 1) == "6") { //d6
    //        roll += Math.floor(Math.random() * Math.floor(6));
    //    } 
    //    else if (dice.substr(1, 1) == "4") { //d4
    //        roll += Math.floor(Math.random() * Math.floor(4));
    //    }
    roll += (Math.floor(Math.random() * Math.floor(parseInt(diceSize))) + 1);
    return roll;
}
function formatDiceSize(dice) {//like d20+1 or d20
    var diceSize;
    if (dice.indexOf('+') != -1) {
        if (dice.indexOf("d") != -1) {
            diceSize = dice.substr(dice.indexOf('d') + 1, dice.indexOf('+') - 3);
        }
        else {
            diceSize = dice.substr(dice.indexOf('D') + 1, dice.indexOf('+') - 3);
        }
    }
    else {
        if (dice.indexOf("d") != -1) {
            diceSize = dice.substr(dice.indexOf('d') + 1);
        }
        else {
            diceSize = dice.substr(dice.indexOf('d') + 1);
        }
    }
    return diceSize;
}
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.content.substr(0, 5) == "!roll") {
        var dice = receivedMessage.content.substr(6);
        for(t = 0; t < dice.length; t++){
            if(dice.indexOf(" ") != -1){
                dice = dice.replace(" ","");
                t--;
            }
        }
        dice = dice.toLowerCase();
        receivedMessage.channel.send(dice);
        var diceArray = dice.split('+');
        var roll = 0;
        var diceOutput = "[";
        var newRoll;
        for (a = 0; a < diceArray.length; a++) {
            if (diceArray[a].charAt(0) == 'd' || diceArray[a].charAt(0) == 'D') {
                diceArray[a].replace(" ","");
                newRoll = makeRoll(formatDiceSize(diceArray[a]));
                roll += newRoll;
                diceOutput += newRoll;
            }
            else if(diceArray[a].indexOf('d') == -1){
                newRoll = parseInt(diceArray[a]);
                roll += newRoll;
                diceOutput += newRoll;
            }
            else {
                try {
                    var diceAmount = parseInt(diceArray[a]);
                    diceOutput += "{";
                    var diceSize = formatDiceSize(diceArray[a]);
                    for (i = 0; i < diceAmount; i++) {
                        newRoll = makeRoll(diceSize)
                        diceOutput += newRoll + ((i < diceAmount - 1) ? '+' : '');
                        roll += newRoll;
                    }
                    diceOutput += "}";
                } catch (ex) { }
            }
            diceOutput += ((a < diceArray.length - 1) ? '+' : '');
        }
        
        receivedMessage.channel.send(diceOutput+"]");
        receivedMessage.channel.send(roll);

    }
});
client.login(auth.token);
//receivedMessage.channel.send("Message received: " + receivedMessage.content);
//https://discordapp.com/api/oauth2/authorize?client_id=653793366638592051&permissions=472913920&scope=bot
function makeRoll(dice) {//must pass in d aswell as number
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
    roll += (Math.floor(Math.random() * Math.floor(parseInt(dice)))+1);
    return roll;
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
        var roll = 0;
        if (dice.charAt(0) == 'd' || dice.charAt(0) == 'D') {
            var diceSize;
            if(dice.indexOf('+') != -1){
                if(dice.indexOf("d") != -1){
                    diceSize = dice.substr(dice.indexOf('d')+1,dice.indexOf('+')-3);
                }
                else{
                    diceSize = dice.substr(dice.indexOf('D')+1,dice.indexOf('+')-3);
                }
            }
            else{
                if(dice.indexOf("d") != -1){
                    diceSize = dice.substr(dice.indexOf('d')+1);
                }
                else{
                    diceSize = dice.substr(dice.indexOf('D')+1);
                }
            }
            roll = makeRoll(diceSize);
        } 
        else {
            try {
                var diceAmount = parseInt(dice);
                var diceOutput = "{";
                var diceSize;
                if(dice.indexOf('+') != -1){
                    if(dice.indexOf("d") != -1){
                        diceSize = dice.substr(dice.indexOf('d')+1,dice.indexOf('+')-3);
                    }
                    else{
                        diceSize = dice.substr(dice.indexOf('D')+1,dice.indexOf('+')-3);
                    }
                }
                else{
                    if(dice.indexOf("d") != -1){
                        diceSize = dice.substr(dice.indexOf('d')+1);
                    }
                    else{
                        diceSize = dice.substr(dice.indexOf('D')+1);
                    }
                }
                var newRoll;
                for(i = 0; i < diceAmount; i++){
                    newRoll = makeRoll(diceSize)
                    diceOutput += newRoll + ((i < diceAmount-1) ? '+' : '');
                    roll += newRoll;
                }
                diceOutput += "}";
                receivedMessage.channel.send(diceOutput);
            } catch (ex) {}

        }
        if (roll != 0) {
            if((index = dice.indexOf("+")) != -1){
                roll += parseInt(dice.substr(dice.indexOf("+") + 1));
            }
        }
        receivedMessage.channel.send(roll);
    }
});
client.login(auth.token);
//receivedMessage.channel.send("Message received: " + receivedMessage.content);
//use this permition integer 472913920
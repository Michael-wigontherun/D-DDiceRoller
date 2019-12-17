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
function outsidePerenth(roll,oporator,num){//returns addedValue instead of roll so it can return 0 if it fails 
    var addedValue = 0;
    if(oporator == "*"){//*
        addedValue = (roll * num) - roll;
    }
    else if(oporator == "+"){// +
        addedValue = (roll + num) - roll;
    }
    else if(oporator == "/"){// /
        addedValue = (roll / num) - roll;
    }
    else if(oporator == "-"){// -
        addedValue = (roll - num) - roll;
    }
    return addedValue;
}
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if(receivedMessage.content == "!roll buried treasure" || receivedMessage.content == "!bt"){
        var roll = makeRoll("100");
        if(roll == 7 || roll == 77 || roll == 40){
            receivedMessage.channel.send("[{100+100+100}]");
            receivedMessage.channel.send("300");
            return;
        }
        else{
            var output = "[{";
            var newRoll;
            for(var i = 0; i < 3; i++){
                newRoll = makeRoll("100");
                roll += newRoll;
                output += newRoll + ((i < 2) ? '+' : '');
            }
            receivedMessage.channel.send(output + "}]");
            receivedMessage.channel.send(roll);
        }
        
    }
    else if (receivedMessage.content.substr(0, 5) == "!roll") {
        var dice = receivedMessage.content.substr(6);
        for(t = 0; t < dice.length; t++){
            if(dice.indexOf(" ") != -1){
                dice = dice.replace(" ","");
                t--;
            }
        }
        var diceOutput = "[";
        dice = dice.toLowerCase();
        var diceOrg;
        if(dice.indexOf('(') != -1 && dice.indexOf(')') != -1){
            //receivedMessage.channel.send(dice.substr(dice.indexOf('(')+1,dice.indexOf(')')-1));
            diceOrg = dice;
            dice = dice.substr(dice.indexOf('(')+1,dice.indexOf(')')-1);
            diceOutput += "(";
        }
        var diceArray = dice.split('+');
        var roll = 0;
        var newRoll;
        for (a = 0; a < diceArray.length; a++) {
            diceArray[a] = diceArray[a].trim();
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
        if(diceOrg != null){
            diceOutput += ")";
            if(diceOrg.length-1 != diceOrg.indexOf(')')){
                roll += outsidePerenth(roll, diceOrg.charAt(diceOrg.indexOf(')')+1), parseInt(diceOrg.charAt(diceOrg.indexOf(')')+2)));
                diceOutput += diceOrg.charAt(diceOrg.indexOf(')')+1);
                diceOutput += diceOrg.charAt(diceOrg.indexOf(')')+2);
            }
        }
        receivedMessage.channel.send(diceOutput+"]");
        receivedMessage.channel.send(roll);

    }
});
client.login(auth.token);
//receivedMessage.channel.send("Message received: " + receivedMessage.content);
//https://discordapp.com/api/oauth2/authorize?client_id=653793366638592051&permissions=472913920&scope=bot
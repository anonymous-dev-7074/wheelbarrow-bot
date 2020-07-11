var figlet = require('figlet');
const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "asciify",
    category: "basic",
    description: "Turns text into ASCII art",
    usage: "--asciify <text>",
    async execute(client, message, args) {
        if(args.length === 0){
            return message.channel.send("You must provide some text!");
        }
        

        figlet('Testing', function(err, data) {
            if (err) {
                message.channel.send("An error occured! Please try again!")
                return;
            }
            message.channel.send(data);
        });
    }
}
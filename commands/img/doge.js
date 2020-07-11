const fetch = require('node-fetch');
const Discord = require("discord.js");


module.exports = {
    name: "doge",
    category: "img",
    description: "Embeds a random doge form r/dogelore",
    usage: "--doge",
    execute(client, message, args){
        fetch('https://www.reddit.com/r/dogelore/top/.json?t=week')
            .then(res => res.json())
            .then(json => {
                const random = Math.floor(Math.random() * json.data.children.length);
                const embed = new Discord.MessageEmbed()
                .setColor(0x00FF00)
                .setTitle(json.data.children[parseInt(random)].data.title)
                .setImage(json.data.children[parseInt(random)].data.url)
                .addField("Info", "Number of upvotes: " + json.data.children[parseInt(random)].data.ups)
                .setFooter("Memes provided by r/dogelore")
                message.channel.send(embed);
            });
    }
}
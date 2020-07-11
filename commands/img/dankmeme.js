const fetch = require('node-fetch');
const Discord = require("discord.js");


module.exports = {
    name: "dankmeme",
    category: "img",
    description: "Embeds a random meme form r/dankmemes",
    usage: "--dankmeme",
    execute(client, message, args){
        fetch('https://www.reddit.com/r/dankmemes.json?sort=top&t=week')
            .then(res => res.json())
            .then(json => {
                const random = Math.floor(Math.random() * json.data.children.length);

                const embed = new Discord.MessageEmbed()
                .setColor(0x00FF00)
                .setTitle(json.data.children[random].data.title)
                .setImage(json.data.children[random].data.url)
                .addField("Info", "Number of upvotes: " + json.data.children[random].data.ups)
                .setFooter("Memes provided by r/dankmemes")
                message.channel.send(embed);

            });
    }
}
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "loop",
    category: "music",
    description: "Loops the current song",
    usage: "--loop",
    execute(client, message, args,vars){
            var server =  vars.data.get(message.guild.id);
            if(!server || !server.player){
                return message.channel.send("Nothing is playing right now.");
            }
            else{
                if(!server.loop){
                    message.channel.send("Looping current track!");
                }
                else{
                    message.channel.send("Un-Looping current track!");
                }
                server.loop = !server.loop;
                vars.data.set(message.guild.id, server);
            }
    }
}
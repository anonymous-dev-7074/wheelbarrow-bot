const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "np",
    category: "music",
    description: "Returns the name of current song",
    usage: "--np",
    execute(client, message, args,vars){

            var server =  vars.data.get(message.guild.id);
            if(!server || !server.player){
                message.channel.send(`Nothing is playing right now.`);
            }
            else{
                const embed = new MessageEmbed()
                .setColor(0x00FF00)
                .setDescription(`Current song is ${server.queue[0].title}
                                Currently at ${millisToMinutesAndSeconds(server.player.returnTime())} of ${millisToMinutesAndSeconds(server.queue[0].length)}
                                ${slider(server.player.returnTime(),server.queue[0].length)}
                                Requested by: ${server.queue[0].requester}`);
    
    
    
                message.channel.send(embed);
            }
    
            function millisToMinutesAndSeconds(millis) {
                var minutes = Math.floor(millis / 60000);
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            }
    
            function slider(time1,time2){
                var percent = ((time1).toFixed(0)/time2).toFixed(1);
                var left = "🔹";
                var right = "🔸";
                return left.repeat(10*percent) +"🔘"+right.repeat(10-(10*percent));
            }
    }
}
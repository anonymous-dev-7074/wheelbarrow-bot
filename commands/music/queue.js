const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "queue",
    aliases: ["q"],
    category: "music",
    description: "Returns server's queue",
    usage: "--queue",
    execute(client, message, args,vars,vars1) {

        var server = vars1.data.get(message.guild.id);

        if (!server || !server.player) {
            message.channel.send("Nothing is in the queue!");
        }
        else {
            const embed = new MessageEmbed()
                .setColor(0x00FF00)
                .setDescription(returnQueue(server.queue));

            message.channel.send(embed);

            function returnQueue(q) {
                var queue = [];
                if (q.length == 0) {
                    return "Nothing is in the queue!"
                }
                else {
                    for (var i = 0; i < q.length; i++) {
                        if(i==0){
                            queue.push(`**${parseInt(i) + 1}.** ${q[i].title} *<== Currently Playing*\n`);
                        }
                        else{
                            queue.push(`**${parseInt(i) + 1}.** ${q[i].title}\n`);
                        }
                    }
                    return queue;
                }
            }
        }
    }
}
module.exports = {
    name: "stop",
    category: "music",
    description: "Stops playing and clears the queue",
    usage: "--stop",
    execute(client, message, args, vars,vars1) {

        var server = vars1.data.get(message.guild.id) || {};

        if (!server || !server.player) {
            message.channel.send("Nothing is in the queue!");
        }
        else if (server.queue[0]) {
            while (server.queue.length > 0) {
                server.queue.pop();
            }
            vars1.data.set(message.guild.id,server);
            server.player.stop();
        }




    }
}
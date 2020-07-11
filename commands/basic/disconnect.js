module.exports = {
    name: "disconnect",
    aliases: ["leave"],
    category: "basic",
    description: "Leaves voice connection, also clears the queue if present",
    usage: "--leave",
    execute(client, message, args, vars) {
        
        var server = vars.data.get(message.guild.id) || {};

        
        if (message.guild.voice) {
            if (!server || !server.queue) {
                message.guild.voice.connection.disconnect();
                message.channel.send("Leaving the voice channel!");
            }
            while (server.queue.length > 0 || server.quiz.queue.length > 0) {
                server.queue.pop();
                server.quiz.queue.pop();
            }
            server.quiz.status = "0";
            message.guild.voice.connection.disconnect();
            vars.data.set(message.guild.id,server);
        }
        else{
            message.channel.send("Currently not connected to voice channel!");
        }
    }
}
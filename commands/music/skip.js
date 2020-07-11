module.exports = {
    name: "skip",
    category: "music",
    description: "Skips current song",
    usage: "--skip",
    execute(client, message, args, vars,vars1) {

        var server = vars1.data.get(message.guild.id);
        
        if (!server || !server.player){
            message.channel.send("Nothing to skip!");
        } 
        else{
            message.channel.send("Skipping current song!");
            server.player.stop();
        }

    }
}
module.exports = {
    name: "nightcore",
    aliases: ["nc"],
    category: "music",
    description: "Nightcore effect",
    usage: "--nightcore",
    execute(client, message, args,vars) {

        var server = vars.data.get(message.guild.id);
        
        if (!server || !server.player){
            message.channel.send("Nothing to nightcore");
        }
        else{
            server.player.pitch(1.2);
            server.player.speed(1.2);
        }

    }
}
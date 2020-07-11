module.exports = {
    name: "clear",
    category: "music",
    description: "Clears sound effects",
    usage: "--clear",
    execute(client, message, args,vars) {


        var server = vars.data.get(message.guild.id);

        if (!server || !server.player){
            message.channel.send("No effects to clear!");
        }
        else{
            server.player.clear();
        }


    }
}
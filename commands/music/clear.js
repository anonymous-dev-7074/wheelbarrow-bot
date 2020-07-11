module.exports = {
    name: "clear",
    category: "music",
    description: "Clears sound effects",
    usage: "--clear",
    execute(client, message, args, vars,vars1) {


        var server = vars1.data.get(message.guild.id);

        if (!server || !server.player){
            message.channel.send("No effects to clear!");
        }
        else{
            server.player.clear();
        }


    }
}
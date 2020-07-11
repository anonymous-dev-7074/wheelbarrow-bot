module.exports = {
    name: "speed",
    aliases: ["sp"],
    category: "music",
    description: "Changes the speed of a song",
    usage: "--speed <value between 0.4 and 2>",
    execute(client, message, args, vars,vars1) {

        var server = vars1.data.get(message.guild.id);
        
        if (!server || !server.player){
            message.channel.send("Nothing to speed up/down");
        }
        else if(!args[0] || parseFloat(args[0])<=0.4|| parseFloat(args[0])>2 || isNaN(parseFloat(args[0]))){
            message.channel.send("You must provide a value above 0.4 and below 2");
        }
        else{
            server.player.speed(parseFloat(args[0]));
        }

    }
}
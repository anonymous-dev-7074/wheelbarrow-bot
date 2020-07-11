module.exports = {
    name: "pitch",
    aliases: ["peach"],
    category: "music",
    description: "Changes the pitch of current song",
    usage: "--pitch <value beween 0.4 and 3>",
    execute(client, message, args,vars) {

        var server = vars.data.get(message.guild.id);
        
        if (!server || !server.player){
            message.channel.send("Nothing to pitch");
        }
        else if(!args[0] || parseFloat(args[0])<=0.4 || parseFloat(args[0]) > 3 || isNaN(parseFloat(args[0]))){
            message.channel.send("You must provide a value between above 0.4 and below 3");
        }
        else{
            server.player.pitch(parseFloat(args[0]));
        }

    }
}
module.exports = {
    name: "seek",
    category: "music",
    description: "Seeks the song to desired position",
    usage: "--seek <position in **seconds**>",
    execute(client, message, args,vars){
            var server =  vars.data.get(message.guild.id);
            if(!server || !server.player){
                return message.channel.send("Nothing is playing right now.");
            }
            else{
                if(isNaN(args[0])){
                    return message.channel.send("You must input a timestamp.");
                }
                else{
                    server.player.seek(parseInt(args[0])*1000);
                }
            }
    }
}
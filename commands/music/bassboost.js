module.exports = {
    name: "bassboost",
    aliases: ["bboost"],
    category: "music",
    description: "Amplifies bass on currently playing song",
    usage: "--bassboost <value between -1 and 1>",
    execute(client, message, args, vars) {

        var server = vars.data.get(message.guild.id);
        
        if (!server || !server.player){
            message.channel.send("Nothing to boost");
        }
        else if(!args[0] || parseFloat(args[0])>1 || parseFloat(args[0])<-1 || isNaN(parseFloat(args[0]))){
            message.channel.send("You must provide a value between -1 and 1");
        }
        else{
            server.player.equalizer([
                {band:0,gain:parseFloat(args[0])},
                {band:1,gain:parseFloat(args[0])},
                {band:2,gain:parseFloat(args[0])},
                {band:3,gain:parseFloat(args[0])}
            ]);
        }

    }
}
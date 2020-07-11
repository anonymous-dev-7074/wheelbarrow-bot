module.exports = {
    name: "remove",
    aliases: ["rm"],
    category: "music",
    description: "Removes song from queue",
    usage: "--remove <position of a song in queue>",
    execute(client, message, args, vars) {

        var server = vars.data.get(message.guild.id);


        if (args.length > 1 || isNaN(parseInt(args[0]))) {
            message.channel.send("Correct usage is: --remove <position in  the queue> !");
        }
        else {
            if(!server || !server.player){
                message.channel.send("Nothing is in the queue!");
            }
            else{
                if (parseInt(args[0]) > server.queue.length || parseInt(args[0]) < 1) {
                    message.channel.send("Number is out of range!");
                }
                else if(parseInt(args[0]) === 1){
                    message.channel.send("Cannot remove song that is playing right now! Use **--skip**!");
                }
                else {
                    message.channel.send(`Removed ${server.queue[parseInt(args[0]) - 1].title} from the queue!`);
                    server.queue.splice(parseInt(args[0]) - 1, 1);
                    vars.data.set(message.guild.id,server);
                }
            }
        }
    }
}
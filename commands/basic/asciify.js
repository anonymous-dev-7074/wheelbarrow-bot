var figlet = require('figlet');


module.exports = {
    name: "asciify",
    category: "basic",
    description: "Turns text into ASCII art",
    usage: "--asciify <text>",
    async execute(client, message, args) {
        if(args.length === 0){
            return message.channel.send("You must provide some text.");
        }    

        figlet(args.join(" "), function(err, data) {
            if (err) {
                return message.channel.send("An error occured. Please try again.");
            }

            if(data.length>=2000){
                message.channel.send("Your message is too long.");
            }
            else{
                message.channel.send('```'+data+'```');
            }
        });
    }
}
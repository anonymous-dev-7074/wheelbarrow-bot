const {Client, Collection} = require("discord.js");

const {config} = require("dotenv");

const fs = require("fs");

const client = new Client({
    disableEveryone: true
});

const server = new Map();
const server1 = new Map();

client.commands = new Collection();
client.aliases = new Collection;
client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", ()=>{
    console.log(`${client.user.username} is online!`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "--help",
        }
    })
});

client.on("message", async message =>{
    const prefix = "--";

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if(!command) command = client.commands.get(client.aliases.get(cmd));

    let vars = {
        data:server
    }

    let vars1 = {
        data:server1
    }

    if(command) 
        command.execute(client, message, args,vars,vars1);
 

});

client.login(process.env.TOKEN);
const { Manager } = require("@lavacord/discord.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { config } = require("dotenv");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "music",
    description: "Plays a song.",
    usage: "--play <song name/url>",
    async execute(client, message, args, vars,vars1) {
        let server = vars1.data.get(message.guild.id) || {};

        var manager=null;

        if (!server.queue) {
            server = {
                queue: [],
                idle: false,
                connection: "",
                timeout: "",
                manager: "",
                player: ""
            }

            vars1.data.set(message.guild.id, server);
        }

        if(server.manager==""){
            const nodes = [
                { id: "1", host: "localhost", port: 2333, password: process.env.lavalinkpassword },
            ];
    
            
            manager = new Manager(client,nodes,{
                user: client.user.id, 
                shards: 1 
            });
    
            
            await manager.connect();
    
            
            manager.on("error", (error, node) => {
                console.log(error);
            });

            const player = await manager.join({
                guild: message.guild.id, // Guild id
                channel: message.member.voice.channel.id, // Channel id
                node: "1" // lavalink node id, based on array of nodes
            });

            server.player=player;
            server.manager=manager;
            vars1.data.set(message.guild.id, server);
        }

        getSongs(`ytsearch: ${args.join(" ")}`).then(songs => {
            if(!server.queue[0]){
                server.queue.push({
                    track: songs[0].track,
                    title: songs[0].info.title,
                    length: songs[0].info.length
                })
                playTest();
            }
            else{
                server.queue.push({
                    track: songs[0].track,
                    title: songs[0].info.title,
                    length: songs[0].info.length
                })
            }

            message.channel.send(`${songs[0].info.title} was added to the queue!`);
            vars1.data.set(message.guild.id, server);
            }
        );


        async function getSongs(search) {
            const node = server.manager.idealNodes[0];
        
            const params = new URLSearchParams();
            params.append("identifier", search);
        
            return fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })
                .then(res => res.json())
                .then(data => data.tracks)
                .catch(err => {
                    console.error(err);
                    return message.channel.send("An error occured please try again!");
                });
        }


        async function playTest(){

            
            await server.player.play(server.queue[0].track); // Track is a base64 string we get from Lavalink REST API

            

            server.player.once("error", error => console.error(error));
            server.player.once("end", async data => {
                if (data.reason === "REPLACED") return; // Ignore REPLACED reason to prevent skip loops
                // Play next song

                server.queue.shift();
                vars1.data.set(message.guild.id, server);

                
                
                if(server.queue[0]){    
                    playTest();
                }
                else{
                    await server.manager.leave(message.guild.id);
                    server.player.pitch(1.0);
                    server.player.speed(1.0);
                    server.player.equalizer([
                        {band:0,gain:0},
                        {band:1,gain:0},
                        {band:2,gain:0},
                        {band:3,gain:0},
                        {band:4,gain:0},
                        {band:5,gain:0},
                        {band:6,gain:0},
                        {band:7,gain:0},
                        {band:8,gain:0},
                        {band:9,gain:0},
                        {band:10,gain:0},
                        {band:11,gain:0},
                        {band:12,gain:0},
                        {band:13,gain:0},
                        {band:14,gain:0},
                    ]);
                    server.manager="";
                    server.player="";
                    vars1.data.set(message.guild.id, server);
                }
            });
            
            // Leave voice channel and destory Player
             // Player ID aka guild id
        }
    }
}
const { Manager } = require("@lavacord/discord.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { config } = require("dotenv");
const stop = require('./stop.js');
const SpotifyWebApi = require('spotify-web-api-node');
const Discord = require("discord.js");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "music",
    description: "Plays a song.",
    usage: "--play <song name/url>",
    async execute(client, message, args, vars) {
        let server = vars.data.get(message.guild.id) || {};

        var manager = null;

        if (!server.queue) {
            server = {
                queue: [],
                idle: false,
                loop: false,
                connection: "",
                timeout: "",
                manager: "",
                player: ""
            }

            vars.data.set(message.guild.id, server);
        }

        if (server.manager == "") {
            const nodes = [
                { id: "1", host: "localhost", port: 2333, password: process.env.lavalinkpassword },
            ];


            manager = new Manager(client, nodes, {
                user: client.user.id,
                shards: 1
            });


            await manager.connect();


            manager.on("error", (error, node) => {
                console.log(error);
            });

            server.manager = manager;


            //check if someone is even listening - every 10 minutes
            server.timeout = setInterval(function () {
                if (!message.member.voice.channel) {
                    stop.execute(client, message, args, vars);
                }
            }, 600000);

            vars.data.set(message.guild.id, server);
        }

        getSongs(`ytsearch: ${args.join(" ")}`).then(async songs => {
            if (!songs[0]) {
                return message.channel.send("An error occurred while searching that song. Please try again.");
            }
            else {
                if (!server.player) {
                    const player = await server.manager.join({
                        guild: message.guild.id,
                        channel: message.member.voice.channel.id,
                        node: "1"
                    });

                    server.player = player;

                    vars.data.set(message.guild.id, server);
                }

                getThumbnail(songs).then((embed) => {

                    if (!server.queue[0]) {
                        server.queue.push({
                            track: songs[0].track,
                            title: songs[0].info.title,
                            length: songs[0].info.length,
                            requester: message.author,
                            message: embed
                        })
                        play();
                    }
                    else {
                        server.queue.push({
                            track: songs[0].track,
                            title: songs[0].info.title,
                            length: songs[0].info.length,
                            requester: message.author,
                            message: embed
                        })
                    }
                    message.channel.send(embed);
                });
            }

            vars.data.set(message.guild.id, server);
        }
        );

        function getThumbnail(songs){
            return new Promise((resolve) => {
            
                var spotifyApi = new SpotifyWebApi({
                    clientId: process.env.CLIENTTOKEN,
                    clientSecret: process.env.CLIENTSECRET
                });
    
                spotifyApi.clientCredentialsGrant().then(function (data) {
                    spotifyApi.setAccessToken(data.body['access_token']);
    
                    spotifyApi.searchTracks(args.join(" ")).then(function (data) {
    
                        var embed;
    
                        if(data.body.tracks.items.length){
    
                            embed = new Discord.MessageEmbed()
                                .setThumbnail(data.body.tracks.items[0].album.images[1].url)
                                .setTitle(`${songs[0].info.title}`)
                                .setDescription("was added to the queue!")
    
                            resolve(embed)
                        }
                        else{
                            const attachment = new Discord.MessageAttachment("./images/stock.png", "stock.png");
    
                            embed = new Discord.MessageEmbed()
                                .attachFiles(attachment)
                                .setThumbnail("attachment://stock.png")
                                .setTitle(`${songs[0].info.title}`)
                                .setDescription("was added to the queue!")
    
                            resolve(embed)
                        }
                    }, function (err) {
                        console.error(err);
                    });
                });
            });
        }


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


        async function play() {

            await server.player.play(server.queue[0].track);



            server.player.once("error", error => console.error(error));
            server.player.once("end", async data => {
                if (data.reason === "REPLACED") return;

                if (!server.loop) {
                    server.queue.shift();
                    vars.data.set(message.guild.id, server);
                }

                if (server.queue[0]) {
                    play();
                }
                else {
                    await server.manager.leave(message.guild.id);
                    clearInterval(server.timeout);
                    server.loop = false;
                    server.manager = "";
                    server.player = "";
                    message.channel.send("Stopping the playback. Goodbye!");
                    vars.data.set(message.guild.id, server);
                }
            });
        }
    }
}
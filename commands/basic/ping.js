module.exports = {
    name: "ping",
    category: "basic",
    description: "Returns latency info",
    usage: "--ping",
    async execute(client, message, args){
        const msg = await message.channel.send(`😎 Pingam...`);

        msg.edit(`😂 Ping je ${Math.floor(msg.createdAt-message.createdAt)} ms\n API Latency ${Math.round(client.ws.ping)} ms`);
    }
}
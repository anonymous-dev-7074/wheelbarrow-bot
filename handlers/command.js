const {readdirSync} = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

        for(let file of commands){

            let pull = require(`../commands/${dir}/${file}`);

            if(pull.name.charAt(0) == "_") continue;

            console.log(pull.aliases);

            if(pull.name){
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            }
            else{
                table.addRow(file, '❌ napaka');
                continue;
            }

            if(pull.aliases){
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }
                
        }
    });
    console.log(table.toString());
}
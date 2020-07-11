const fetch = require('node-fetch');
const {config} = require("dotenv");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "weather",
    category: "weather",
    description: "Displays weather forecast",
    usage: "--weather <location name>",
    execute(client, message, args){
        const cname = args.join(" ");
        const wt = process.env.WTOKEN;
        
        var arr=[];
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cname}&appid=${wt}`).then(response => response.json())
        .then(json => {
            for(var i = 0;i<json.list.length;i++){
                if(json.list[i].dt_txt.split(" ")[1]==="09:00:00" || json.list[i].dt_txt.split(" ")[1]==="15:00:00" || json.list[i].dt_txt.split(" ")[1]==="21:00:00"){
                    if(json.list[i].weather[0].main=="Clear"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":sunny:");
                    }
                    else if (json.list[i].weather[0].main=="Clouds"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":cloud:");
                    }
                    else if (json.list[i].weather[0].main=="Snow"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":cloud_snow:");
                    }
                    else if (json.list[i].weather[0].main=="Rain"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":cloud_rain:")
                    }
                    else if (json.list[i].weather[0].main=="Drizzle"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":cloud_rain:")
                    }
                    else if (json.list[i].weather[0].main=="Thunderstorm"){
                        arr.push(returnDay(new Date(json.list[i].dt_txt.split(" ")[0]).getDay()));
                        arr.push(":thunder_cloud_rain:")
                    }
                }
            }
        }).then(function(){
            const embed = new MessageEmbed()
            .setTitle('Weather in'+" "+cname.toUpperCase())
            .addFields(
                { name: arr[0], value: "8:00: "+arr[1]+" 15:00: "+arr[3]+" 21:00: "+arr[5], inline: false },
                { name: arr[6], value: "8:00: "+arr[7]+" 15:00: "+arr[9]+" 21:00: "+arr[11], inline: false },
                { name: arr[12], value: "8:00: "+arr[13]+" 15:00: "+arr[15]+" 21:00: "+arr[17], inline: false },
                { name: arr[18], value: "8:00: "+arr[19]+" 15:00: "+arr[21]+" 21:00: "+arr[23], inline: false },
                { name: arr[24], value: "8:00: "+arr[25]+" 15:00: "+arr[27]+" 21:00: "+arr[29], inline: false }
            )
            message.channel.send(embed);
        }).catch(function(error){
            message.channel.send("An error occured! Please try again!");
        }); 
        
        function returnDay(num){
            if(num==0){
                return "SUN";
            }
            else if(num==1){
                return "MON"
            }
            else if(num==2){
                return "TUE"
            }
            else if(num==3){
                return "WED"
            }
            else if(num==4){
                return "THU"
            }
            else if(num==5){
                return "FRI"
            }
            else{
                return "SAT"
            }
        }
    }
}
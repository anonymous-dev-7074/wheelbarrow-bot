const sharp = require('sharp');
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const dataUriToBuffer = require('data-uri-to-buffer');
const text2png = require('text2png');

module.exports = {
    name: "tweet",
    category: "img",
    description: "Makes a tweet",
    usage: "--tweet [tweet text]",
    async execute(client, message, args) {

        var readStream = fs.createReadStream("./images/base.png");



        if(args.join(" ").length>140){
            message.channel.send("Tweet is too long!");

        }
        else{
            fetch(message.author.avatarURL({format: "png"}))
            .then(res => res.buffer())
            .then(function(data){

                const canvas = createCanvas(467, 70);
                const ctx = canvas.getContext('2d');
                ctx.font = '24px Segoe UI';

                wrapText(ctx,args.join(" "),0,20,467,20);

                var txt = canvas.toBuffer();
                

                var time = timeConvert(String(message.createdAt));

                
                
                var userName = text2png(String(message.author.username),{
                    font: '24px Segoe UI',
                    output: 'buffer',
                    strokeWidth: 0.3,
                    strokeColor: "black"
                });

                var userNameAt = text2png(String("@"+message.author.username),{
                    font: '18px Segoe UI',
                    output: 'buffer',
                    color: "gray"
                });

                var dateNtime = text2png(time,{
                    font: '18px Segoe UI',
                    output: 'buffer',
                    color: "gray",
                });

                var i = (Math.round(Math.random()*900)/10);

                var rt = text2png(String((i/4+10).toFixed(1))+"K",{
                    font: '20px Segoe UI',
                    output: 'buffer',
                    color: "black",
                    strokeWidth: 0.4,
                    strokeColor: "black"
                });

                var likes = text2png(String((i+10).toFixed(1))+"K",{
                    font: '20px Segoe UI',
                    output: 'buffer',
                    color: "black",
                    strokeWidth: 0.4,
                    strokeColor: "black"
                });
                
    
                sharp(data)
                .resize(80, 80)
                .toBuffer(function(err, data, info){
    
                    if (err){
                        console.log(err);
                        return message.channel.send("Oops... an error occured!");
                    } 
    
                    
                    const base = sharp()
                    .composite([
                        {
                        input: data,
                        blend: 'dest-over',
                        top: 15,
                        left: 15
                        },
                        {
                        input: txt,
                        blend: 'over',
                        top: 120,
                        left: 20 
                        },
                        {
                        input: userName,
                        blend: 'over',
                        top: 30,
                        left: 105
                        },
                        {
                        input: userNameAt,
                        blend: 'over',
                        top: 53,
                        left: 102
                        },
                        {
                        input: dateNtime,
                        blend: 'over',
                        top: 220,
                        left: 20
                        },
                        {
                        input: rt,
                        blend: 'over',
                        top: 277,
                        left: 22
                        },
                        {
                        input: likes,
                        blend: 'over',
                        top: 277,
                        left: 181
                        }
                    ]);
        
    
                    var stream = readStream.pipe(base);
    
                    stream.once('finish', function () {
                        message.channel.send("", {
                            files: [{
                                attachment: stream,
                                name: 'tweet.png'
                            }]
                        });
                    });
    
                });
    
    

    
            });

        }

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var line = '';
    
            for(var n = 0; n < words.length; n++) {
              var testLine = line + words[n] + ' ';
              var metrics = context.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
              }
              else {
                line = testLine;
              }
            }
            context.fillText(line, x, y);
          }

          function timeConvert(time){
            var time1=time.substr(16, 8);
            var H = +time1.substr(0, 2);
            var h = (H % 12) || 12;
            var ampm = H < 12 ? "AM" : "PM";
            time1 = h + time1.substr(2, 3) +" "+ ampm;

            var date1 = time.substr(4,6);
            var date2 = time.substr(11,4);


            return time1+" "+"-"+" "+date1+","+" "+date2;
          }

 


    }
}
const fetch = require('node-fetch');
const sharp = require('sharp');
const intoStream = require('into-stream');
const imageType = require('image-type');
const validUrl = require('valid-url');
const eyelocate = require('../basic/_eyelocate.js');

module.exports = {
    name: "wobblyeyes",
    aliases: ["wob"],
    category: "img",
    description: "Turns eyes into wobbly eyes",
    usage: "--wobblyeyes [user tag or image url or attached image]",
    note: "If no argument is provided senders profile picture will be used.",
    async execute(client, message, args){

        function makeWobble(link) {
            fetch(link)
                .then(res => res.buffer())
                .then(function (data1) {

                    var type = imageType(data1);
                    if (type == null) {
                        return message.channel.send("Provided image must be png or jpg format");
                    }
                    else if (type.ext == "jpg" || type.ext == "png") {
                        var stream = sharp(data1);

                        stream.metadata()
                            .then(function (metadata) {
                                return metadata.width;
                            })
                            .then(function (data) {

                                    eyelocate.execute('{"url": ' + '"' + link + '"}', async (res) => {

                                    if(res==null) return message.channel.send("Could not locate parts of the image! Try using another one.");

                                    var left = (res[3].y-res[2].y)*5;
                                    var right = (res[5].y-res[4].y)*5;

                                    var size = Math.max(parseInt(left),parseInt(right));

                                    
    
                                    var leftEye = await sharp("images/left.png")
                                        .resize(parseInt(size), parseInt(size))
                                        .toBuffer();
    
                                    var rightEye = await sharp("images/right.png")
                                        .resize(parseInt(size), parseInt(size))
                                        .toBuffer();
    
                                    var leftP = res[0]; //P -> pupil
                                    var rightP = res[1];
    
                                    const overlay = sharp()
                                        .composite([
                                            {
                                                input: leftEye,
                                                blend: "over",
                                                top: parseInt(leftP.y-size/2),
                                                left: parseInt(leftP.x-size/2)
                                            },
                                            {
                                                input: rightEye,
                                                blend: "over",
                                                top: parseInt(rightP.y-size/2),
                                                left: parseInt(rightP.x-size/2),
                                            },
                                        ]);
    
    
    
    
    
                                    var result = intoStream(data1).pipe(overlay);
    
    
                                    result.once("finish", function () {
                                        message.channel.send("", {
                                            files: [{
                                                attachment: result,
                                                name: "wobble.png"
                                            }]
                                        });
                                    });
                                });

                            });
                    }
                    else {
                        return message.channel.send("Provided image must be png or jpg format");
                    }
                });
        }


        if (args.length > 1) {
            return message.channel.send("Too many parameters! Use --help wobblyeyes for usage instructions!");
        }
        else {
            if (message.attachments.size == 1) {
                makeWobble(message.attachments.first().url);
            }
            else if (message.mentions.users.size == 1) {
                makeWobble(await message.mentions.users.first().avatarURL({ format: "png" }));
            }
            else if (args.length==1 && validUrl.isUri(args[0])) {
                makeWobble(args[0]);
            }
            else {
                makeWobble(await message.author.avatarURL({ format: "png" }));
            }
        }

    }
}
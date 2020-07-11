const fetch = require('node-fetch');
const sharp = require('sharp');
const intoStream = require('into-stream');
const imageType = require('image-type');
const validUrl = require('valid-url');
const eyelocate = require('../basic/_eyelocate.js');

module.exports = {
    name: "woke",
    category: "img",
    description: "Makes woke eyes lol",
    usage: "--woke [user tag or image url or attached image] [1-4]",
    note: "If no argument is provided senders profile picture will be used.",
    async execute(client, message, args) {

        var img = "images/glow";

        if (!isNaN(args[args.length - 1])) {
            if (args[args.length - 1] < 5 && args[args.length - 1] > 0) {
                img = img + args[args.length - 1] + ".png";
            }
            else {
                message.channel.send("Number is out of range. Reverting to default value!");
                img = img + ".png";
            }
        }
        else {
            img = img + ".png";
        }

        if (args.length > 2) {
            return message.channel.send("Too many parameters! Use --help woke for usage instructions!");
        }
        else {
            if (message.attachments.size == 1) {
                makeWoke(message.attachments.first().url);
            }
            else if (!isNaN(args[0]) && args.length == 1) {
                makeWoke(await message.author.avatarURL({ format: "png" }));
            }
            else if (message.mentions.users.size == 1) {
                makeWoke(await message.mentions.users.first().avatarURL({ format: "png" }));
            }
            else {
                if (args.length == 0) {
                    makeWoke(await message.author.avatarURL({ format: "png" }));
                }
                else {
                    if (validUrl.isUri(args[0])) {
                        makeWoke(args[0]);
                    }
                    else {
                        return message.channel.send("Invalid URL!");
                    }
                }
            }
        }

        function makeWoke(link) {
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

                                    var left = res[0];
                                    var right = res[1];
    
                                    var leftEye = await sharp(img)
                                        .resize(parseInt(left.x), parseInt(left.y))
                                        .toBuffer();
    
                                    var rightEye = await sharp(img)
                                        .resize(data - parseInt(right.x), parseInt(right.y))
                                        .toBuffer();
    
    
    
                                    const overlay = sharp()
                                        .composite([
                                            {
                                                input: leftEye,
                                                blend: "over",
                                                top: parseInt(left.y / 2),
                                                left: parseInt(left.x / 2)
                                            },
                                            {
                                                input: rightEye,
                                                blend: "over",
                                                top: parseInt(right.y / 2),
                                                left: parseInt(right.x - ((data - right.x) / 2)),
                                            },
                                        ]);
    
    
    
                                    var result = intoStream(data1).pipe(overlay);
    
    
                                    result.once("finish", function () {
                                        message.channel.send("", {
                                            files: [{
                                                attachment: result,
                                                name: "woke.png"
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

    }
}
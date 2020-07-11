const sharp = require('sharp');
const fetch = require('node-fetch');
const validUrl = require('valid-url');
const imageType = require('image-type');
const intoStream = require('into-stream');

module.exports = {
    name: "deepfry",
    category: "img",
    description: "Deepfries an image.",
    usage: "--deepfry [user tag or image url or attached image]",
    note: "If no argument is provided senders profile picture will be used.",
    async execute(client, message, args) {

        var user;

        if (args.length === 0 && message.attachments.size == 0) {
            user = message.author;
            
            var tf = sharp()
            .sharpen(3, 200, 600)
            .modulate({
                saturation: 5,
                hue: 20
            })
            .resize(512, 512)


            makeImg(await user.avatarURL({
                format: "png"
            }),tf);
        }
        else if (args.length === 1) {
            if(validUrl.isUri(args[0])){

                var tf = sharp()
                .sharpen(3, 200, 600)
                .modulate({
                    saturation: 5,
                    hue: 20
                })
                


                makeImg(args[0],tf);
            }
            else{
                if ((user = await getUserFromMention(args[0])) === null) {
                    message.channel.send("Invalid command format");
                }
                else {
                    var tf = sharp()
                    .sharpen(3, 200, 600)
                    .modulate({
                        saturation: 5,
                        hue: 20
                    })
                    .resize(512, 512)

                    try {
                        makeImg(await user.avatarURL({
                            format: "png"
                        }),tf);
                    } catch (error) {
                        return message.channel.send("There was an error getting that user's avatar!");
                    }

                }
            }
        }
        else if(message.attachments.size == 1){
            var tf = sharp()
            .sharpen(3, 200, 600)
            .modulate({
                saturation: 5,
                hue: 20
            })
            


            makeImg(message.attachments.first().url,tf);

        }
        else {
            return message.channel.send("Invalid command format");
        }





        function makeImg(u,transformer) {
            fetch(u)
            .then(res => res.buffer())
            .then(function(data){

                var type = imageType(data);
                if(type==null || (type.ext != "jpg" && type.ext != "png")){
                    return message.channel.send("Provided image must be png or jpg format");
                }

                var stream = intoStream(data).pipe(transformer);

                stream.once('finish', function () {
                    message.channel.send("", {
                        files: [{
                            attachment: stream,
                            name: 'fry.png'
                        }]
                    });
                });
            }); 
        }




        async function getUserFromMention(mention) {
            if (!mention) return;

            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);

                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }

                return client.users.cache.get(mention);
            }
            else {
                return null;
            }
        }
    }
}
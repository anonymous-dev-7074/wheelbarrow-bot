# wheelbarrow bot

![Logo](https://i.imgur.com/JIk9chf.png)

## Basic information

Wheelbarrow is a general purpose Discord bot written in JavaScript using [Discord.js](https://github.com/discordjs/discord.js) library.

## Features

* Wheelbarrow offers basic music commands using Lavalink. It uses a modified version of Lavalink that can run music effects such as speed and pitch. Currently it depends on **modified version of [@lavacord/discord.js](https://github.com/lavacord/discord.js) for it to run these effects.** 

* Some basic meme image processing 

* 5-day weather forecast

* **TO-DO**

## Installation

* [Here](https://github.com/casko1/Lavalink) is my forked repository of Lavalink that includes filter features. Configuration instructions can be found [here](https://github.com/casko1/Lavalink#server-configuration). You need to run seperate server for Lavalink in order to use music features. More information can be found on their [github page](https://github.com/Frederikam/Lavalink).

* Besides the required modules there needs to be .env file with the following keys set

* TOKEN (your discord bot token)
* WTOKEN (openweathermap.org token)
* subscriptionKey (Microsoft azure facial recognition service token)
* lavalinkpassword (which you need to set accordingly in application.yml file)
* CLIENTTOKEN (Spotify API client token) -> for cover images
* CLIENTSECRET (Spotify API client secret) -> for cover images

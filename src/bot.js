require("dotenv/config");
const func = require("../functions/func");

const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "hello") {
    message.reply("hello there");
  }

  if (message.author.bot) return false;
  if (message.content === "I love you") {
    message.channel.send("I love you too");
  }


  if (message.content.startsWith("!")) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring("!".length)
      .split(/\s+/);

    if (CMD_NAME == "randommov" && args.length == 0) {
      const json_data = await func.randommovie();
      if(json_data.error){
        message.channel.send(json_data.error);
        return
      }
      const exampleEmbed = new MessageEmbed()
        .setTitle(json_data.name)
        .setColor("#ff2050")
        .setImage(json_data.poster)
        .setDescription(json_data.plot)
        .setFooter(`Budget: ${json_data.budget}`)
        .setFooter(`Runtime: ${json_data.runtime} mins`)
        .addField("Release date:", `${json_data.date}`, true)
        .addField("Genres:", `${json_data.genres.toString()}`, true)
        .addField("Languages", `${json_data.lang}`, true);
      message.channel.send({ embeds: [exampleEmbed] });
    } 
    

    else if (CMD_NAME == "createtextchannel") {
      if (args.length > 0) {
        args.map((item) => {
          message.guild.channels
            .create(item, {
              type: "text",
              permissionOverwrites: [
                {
                  id: message.guild.roles.everyone,
                  allow: [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "READ_MESSAGE_HISTORY",
                  ],
                },
              ],
            })
            .then((channel) => {
              const categoryID = process.env.CATEGORY_ID;
              channel.setParent(categoryID);
              const chnl = client.channels.cache.find(
                (chann) => chann.name === item
              );
              const exampleEmbed = new MessageEmbed()
                .setTitle(`Welcome everyone to`)
                .setColor("#ff2050")
                .addField("Channel:", `${chnl.name}`, true);
              chnl.send({ embeds: [exampleEmbed] });
            });
        });
      } else {
        const exampleEmbed = new MessageEmbed()
          .setTitle(`Please provide channel name(s)`)
          .setColor("#ff2050")
          .addField("Channel:", "no channel name provided", true);
        message.channel.send({ embeds: [exampleEmbed] });
      }
    }
    

    else if (CMD_NAME == "upcommov" && args.length == 0) {
      const json_data = await func.validURI(process.env.UPCOMING);
      if(json_data.error){
        message.channel.send(json_data.error);
        return
      }
      const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("The upcoming movies are: ")
        .setDescription(
          `Release dates between ${json_data.min} and ${json_data.max}`
        );
      json_data.name.forEach((item) => {
        exampleEmbed.addField(
          item.titlename,
          `Release date: ${item.releasedate}`
        );
      });
      message.channel.send({ embeds: [exampleEmbed] });
    } 
    

    else if (CMD_NAME == "topratedmov" && args.length == 0) {
      const json_data = await func.validURI(process.env.TOP_RATED);
      if(json_data.error){
        message.channel.send(json_data.error);
        return
      }
      const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("The top rated movies are:");
      json_data.name.forEach((item) => {
        exampleEmbed.addField(
          item.titlename,
          `Release date: ${item.releasedate}`
        );
      });
      message.channel.send({ embeds: [exampleEmbed] });
    } 
    

    else if (CMD_NAME == "popmov" && args.length == 0) {
      const json_data = await func.validURI(process.env.POPULAR);
      if(json_data.error){
        message.channel.send(json_data.error);
        return
      }
      const exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("The popular movies are:");
      json_data.name.forEach((item) => {
        exampleEmbed.addField(
          item.titlename,
          `Release date: ${item.releasedate}`
        );
      });
      message.channel.send({ embeds: [exampleEmbed] });
    }


    // else if(CMD_NAME == "movie"){
      
    // }
 
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);

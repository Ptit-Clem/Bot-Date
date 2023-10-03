const {Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require("discord.js");
const fs = require("fs-extra")
require('dotenv').config()
const ethers = require("ethers");
const ABI_V5 = require("./ABI_V5.json");


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildInvites
    ] 
});


const ID = process.env.ID
const TOKEN = process.env.TOKEN

client.on("ready", () => {
    console.log("bot opéationnel");
})

const _getnodes = new SlashCommandBuilder()
    .setName('getnodes')
    .setDescription('See how many nodes someone have')
    .addStringOption((option) =>
        option.setName("address")
        .setDescription('Address')
        .setRequired(true)
    )

const _getstorm = new SlashCommandBuilder()
    .setName('getstorm')
    .setDescription('See how many storm someone missed')
    .addStringOption((option) =>
        option.setName("address")
        .setDescription('Address')
        .setRequired(true)
    )

const commands = [
    _getnodes,
    _getstorm,

];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(Routes.applicationCommands(ID), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();


client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try  {
    
        if (interaction.commandName === 'getnodes') {

            const address = interaction.options.get('address').value;
            const rpc = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/");
            
            const node = new ethers.Contract('0xFAF22148C122F4a745E9828638226506df1ec124', ABI_V5, rpc);

            let nuclearCount = (await node.getNodeNumberOf(address, "SUPERHUMAN")).toString();
            let windCount = (await node.getNodeNumberOf(address, "HUMAN")).toString();
            let hydroCount = (await node.getNodeNumberOf(address, "MICROSCOPIC")).toString();
            let solarCount = (await node.getNodeNumberOf(address, "FLATVERSAL")).toString();


            const embded = new EmbedBuilder()
                        .setColor([255, 187, 0])
                        .setTitle('Node Of User')
                        .setDescription(`Nuclear Count : **${nuclearCount}**
                                         Solar Count : **${solarCount}**
                                         Wind Count : **${windCount}**
                                         Hydro Count : **${hydroCount}**`)

                        interaction.reply({embeds: [embded]})


        }

        if (interaction.commandName === 'getstorm') {

            const address = interaction.options.get('address').value;
            const rpc = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/");
            
            const node = new ethers.Contract('0xFAF22148C122F4a745E9828638226506df1ec124', ABI_V5, rpc);

            let stormMissed = (await node.getRealStormPassed(address)).toString();

            const embded = new EmbedBuilder()
                        .setColor([255, 187, 0])
                        .setTitle('Node Of User')
                        .setDescription(`Storm Missed : **${stormMissed}**`)

                        interaction.reply({embeds: [embded]})

        }

}
catch (error) {
   console.log(error);

}

});



client.login(TOKEN);
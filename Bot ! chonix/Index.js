const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, roleMention, MembershipScreeningFieldType, IntegrationApplication } = require("discord.js");
const fs = require("fs-extra")

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences

    ] 
});
const TOKEN =
    'MTA0NDY3MzM1NTk2NzYzNTU4Ng.GbNx7o.jGQfWXDIPKSSSZO3Hk8gkNmd2SBJfE05NvLyqA';

client.on("ready", () => {
    console.log("bot opéationnel");

})

const _createchannel = new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('Création du Channel avec le nombre de Membre présent sur le serv');

const _createchannelonline = new SlashCommandBuilder()
    .setName('createchannelonline')
    .setDescription('Création du Channel avec le nombre de Membre en ligne présent sur le serv');

const commands = [
    _createchannel,
    _createchannelonline,

];

let config

(async () => {
    try {
        config = await fs.readJson('./config.json')
    } catch (error) {
        config = {}
        await fs.writeJson('./config.json', config)
    }
})();


const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(Routes.applicationCommands("1044673355967635586"), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try  {
        
        if (interaction.commandName === 'createchannel') {
            const channel = await interaction.guild.channels.create({ name: `💎 - Membres: ` + interaction.guild.memberCount, type: 2 })

            console.log(interaction.guildId)

            config[interaction.guildId] = {
                channelId: channel.id
            }
        }

        await fs.writeJson('./config.json', config)
        interaction.reply("Le Channel a bien été crée")
    } 
    
    
    catch (error) {
       console.log(error);
    }
})

const RenameChannel = async(guild) => {
    if (config != undefined) {
        //Recupere le channel a changer

        let channel = guild.channels.cache.get(config[guild.id].channelId)

        //Rename le channel
        nombrePersonne = guild.memberCount
        channel.setName("💎 - Membres: " + nombrePersonne)

    }
} 

client.on("guildMemberAdd", async(member)  => {
    RenameChannel(member.guild)
})

client.on("guildMemberRemove", async(member)  => {
    RenameChannel(member.guild)
})


client.login(TOKEN);
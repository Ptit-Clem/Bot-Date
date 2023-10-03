
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, roleMention, MembershipScreeningFieldType } = require("discord.js");
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ] 
});
const TOKEN =
    'MTA0MjQ2MjQ2NzcwNTU0MDYwOQ.G01jUJ.yucS1qwJsbs7xDrg8TE_UGi57UsSZp70yINB38';

client.on("ready", () => {
    console.log("bot opéationnel");

})

const _ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('chinois');

const _pute = new SlashCommandBuilder()
    .setName('pute')
    .setDescription('JAI DIT PUTE');

const _pabs = new SlashCommandBuilder()
    .setName('pabs')
    .setDescription('BIG BOOBS');
    
const _kangoo = new SlashCommandBuilder()
    .setName('kangoo')
    .setDescription('JAI 10 KANGOO TOUTE NEUF');

const _xp = new SlashCommandBuilder()
    .setName('xp')
    .setDescription('cc');

    const _ticket = new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Création du message ticket');


const commands = [
    _ping,
    _pabs,
    _pute,
    _kangoo,
    _xp,
    _ticket
];


const rest = new REST({ version: '10' }).setToken("MTA0MjQ2MjQ2NzcwNTU0MDYwOQ.Gj0HIC.iivV4MxRcM7ooPMb8NqLfyfdPkrA9h5F-uuoZA");
  
(async () => {
try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("1042462467705540609"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}
})();

//quand on entre en relation avec le bot
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try  {
        //si on tape la commande ping
        if (interaction.commandName === 'ping') {
            // Renvoie un un message privé à l'utilisateur
            interaction.user.send ("Pong")
        } 

        if (interaction.commandName === 'pabs') {
            // Renvoie un un message privé à l'utilisateur
            interaction.reply({ files: ['https://media.discordapp.net/attachments/1042526234506174576/1042899616015847474/Capture_decran_2022-11-17_123926.png']})
            // Ajoute une réaction au message
            const message = await interaction.fetchReply();
            message.react('🥄');
            
        } 

        if (interaction.commandName === 'pute') {
            // Renvoie un un message privé à l'utilisateur
            interaction.user.send ("JAI DIT PUTES")
            // Envoyer une photo privé à l'utilisateur
            interaction.user.send({ files: ['https://static-ca-cdn.eporner.com/gallery/fo/IO/h1JVk7VIOfo/842483-mia-khalifa-nude.jpg']})
        }

        if (interaction.commandName === 'kangoo') {
            // Renvoie un un message privé à l'utilisateur
            interaction.reply ("J'AI 10 KANGOO TOUTE NEUF\n https://www.youtube.com/watch?v=jK4wnCLuBtI")
        }
          
        if (interaction.commandName === 'ticket') {
            interaction.reply("YOPPPPPPP")
            // créer un nouveau channel*
            console.log(interaction.user)
            interaction.guild.channels.create({ name: `Ticket de ${interaction.user.username}` })
        }
          

     }
    catch (error) {
       console.log(error);
    
    }
    
})

let xp = {}
let level = {}
level['446049019341570060'] = 1
xp['446049019341570060'] = 5

client.on('messageCreate', async message => {
   
    if(message.author.bot === false){

        if(xp[message.author.id] === undefined){
            xp[message.author.id] = 0
        }
        
        if (message.content.length < 50 ) {
            xp[message.author.id] = xp[message.author.id]+1
            message.reply ("tu as : " +  xp[message.author.id] + " XP") 
        }

        else if (message.content.length < 250 ) {
            xp[message.author.id] = xp[message.author.id]+2
            message.reply ("tu as : " +  xp[message.author.id] + " XP") 
        }

        else if (message.content.length < 750 ) {
            xp[message.author.id] = xp[message.author.id]+3
            message.reply ("tu as : " +  xp[message.author.id] + " XP") 
        }

        else  {
            xp[message.author.id] = xp[message.author.id]+4
            message.reply ("tu as : " +  xp[message.author.id] + " XP") 
        }

        if(level[message.author.id] === undefined){
            level[message.author.id] = 0
        }

        if(xp[message.author.id] > 9){
            level[message.author.id] = level[message.author.id]+1
            message.reply ("tu es level " +  level[message.author.id])
            // Ajouter un rôle
            if ("1042803191944839169") message.guild.members.cache.get(message.author.id).roles.add("1042803191944839169");
            xp[message.author.id] = 0
        }

        
    }

     

    

    console.log(xp);

})

client.login("MTA0MjQ2MjQ2NzcwNTU0MDYwOQ.Gj0HIC.iivV4MxRcM7ooPMb8NqLfyfdPkrA9h5F-uuoZA");
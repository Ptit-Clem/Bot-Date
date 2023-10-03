const { Collection, Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder,roleMention, PermissionFlagsBits } = require("discord.js");
const fs = require("fs-extra")
require('dotenv').config()


let channelId = fs.readJSONSync("FichierJson/channel.json")
let NombreBump = fs.readJSONSync("FichierJson/NombreBump.json")
let NombreBumpWeek = fs.readJSONSync("FichierJson/BumpWeek.json")
let NombreInvitation = fs.readJSONSync("FichierJson/Invite.json")
let NombreInvitationRemove = fs.readJSONSync("FichierJson/InviterPartit.json")
let PersonneAyantInvitee = fs.readJSONSync("FichierJson/PersonneAyantInvitee.json")
let ChannelBump = fs.readJSONSync("FichierJson/channelbump.json")
let Role = fs.readJSONSync("FichierJson/Role.json")

// Initialize the invite cache
const invites = new Collection();

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

    client.guilds.cache.forEach(async (guild) => {
        // Fetch all Guild Invites
        const firstInvites = await guild.invites.fetch();
        // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
        invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    });
})

const _createchannelinvit = new SlashCommandBuilder()
    .setName('setchannelinvitation')
    .setDescription('Création du Channel pour voir les invitations')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const _createchannelbump = new SlashCommandBuilder()
    .setName('setchannelbump')
    .setDescription('Création du Channel pour ping de faire un bump')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);    

const _weekbump = new SlashCommandBuilder()
    .setName('weekbump')
    .setDescription('Nombre Total de Bump + Nombre Total de Bump de la semaine')
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )

const _rankingbump = new SlashCommandBuilder()
    .setName('rankingbump')
    .setDescription('Classement Total de Bump + Nombre Total de Bump de la semaine passée')

const _cminvitation = new SlashCommandBuilder()
    .setName('invitation')
    .setDescription('Nombre Total dinvitation')
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )

const _setrolebump = new SlashCommandBuilder()
    .setName('setrolebump')
    .setDescription('Permet de séléctionner le rôle à ping pour les bumps ')
    .addRoleOption((option) =>
        option.setName("role")
        .setDescription('ping le role')
        .setRequired(true)
    )

const _help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Liste des commandes')


const commands = [
    _createchannelinvit,
    _weekbump,
    _rankingbump,
    _cminvitation,
    _help,
    _createchannelbump,
    _setrolebump

];

const getServerChannel = (guildID) => {
    //récupère le serveur à partir de l'ID du serveur
    var guild = client.guilds.cache.get(guildID);
    //Vérifie si il n'y a pas de channel sauvegardé par rapport au serv
    if (channelId[guildID] == undefined) {
        //récupère le permier channel ecrit du serveur
        const channel = guild.channels.cache.filter(c => c.type === 0).find(x => x.position == 0);
        // Sauvegarde l'id du channel dans la db local
        channelId[guildID] = channel.id
        // Sauvegarde dans le fichier channel.json
        fs.writeJSONSync("FichierJson/channel.json", channelId)
    }
    return guild.channels.cache.get(channelId[guildID])
}

const getRoleChannel = (guildID) => {
    //récupère le serveur à partir de l'ID du serveur
    var guild = client.guilds.cache.get(guildID);
    //Vérifie si il n'y a pas de channel sauvegardé par rapport au serv
    if (ChannelBump[guildID] == undefined) {
        //récupère le permier channel ecrit du serveur
        const channel = guild.channels.cache.filter(c => c.type === 0).find(x => x.position == 0);
        // Sauvegarde l'id du channel dans la db local
        ChannelBump[guildID] = channel.id
        // Sauvegarde dans le fichier channel.json
        fs.writeJSONSync("FichierJson/Role.json", ChannelBump)
    }
    return guild.channels.cache.get(ChannelBump[guildID])
}

const getTotalBump = (guildId, userId) => {
    if(NombreBump[guildId] === undefined){  
        NombreBump[guildId] = {}
    }
    
    if(NombreBump[guildId][userId] === undefined){  
        NombreBump[guildId][userId] = 0
    }

    return NombreBump[guildId][userId] 
}

const getWeeklyBump = (guildId, weekId, userId) => {
    if(NombreBumpWeek[guildId] === undefined){  
        NombreBumpWeek[guildId] = {}
    }
    
    if(NombreBumpWeek[guildId][weekId] === undefined) {
        NombreBumpWeek[guildId][weekId] = {}
    }

    if(NombreBumpWeek[guildId][weekId][userId] === undefined){  
        NombreBumpWeek[guildId][weekId][userId] = 0
    }

    return NombreBumpWeek[guildId][weekId][userId] 
}

const getNombreInvitation = (guildId, inviter) => {
    if(NombreInvitation[guildId] === undefined){  
        NombreInvitation[guildId] = {}
    }
    

    if(NombreInvitation[guildId][inviter] === undefined){  
        NombreInvitation[guildId][inviter] = 0
    }

    return NombreInvitation[guildId][inviter]
}

const getNombreInvitationRemove = (guildId, inviteur) => {
    if(NombreInvitationRemove[guildId] === undefined){  
        NombreInvitationRemove[guildId] = {}
    }

    if(NombreInvitationRemove[guildId][inviteur] === undefined){  
        NombreInvitationRemove[guildId][inviteur] = 0
    }

    return NombreInvitationRemove[guildId][inviteur]
}

const getPersonneAyantInvitee = (guildId, inviter) => {
    if(PersonneAyantInvitee[guildId] === undefined){  
        PersonneAyantInvitee[guildId] = {}
    }

    if(PersonneAyantInvitee[guildId][inviter] === undefined){  
        PersonneAyantInvitee[guildId][inviter] = 0
    }


    return PersonneAyantInvitee[guildId][inviter]
}

const sortArray = (array) => {
    let nombresARanger = Object.values(array)
    let utilisateurARanger = Object.keys(array)
    let nombreRanger = []
    let utilisateurRanger = []

    utilisateurRanger[0] = utilisateurARanger[0]
    nombreRanger[0] = nombresARanger[0]
    

    for(indexNombreARanger=1; indexNombreARanger < nombresARanger.length ; indexNombreARanger++){ // Elle regarde tous les indexes du tableau nombresARanger

        let nombreARanger = nombresARanger[indexNombreARanger]
        let nombreEstRange = false

        for(indexNombreRanger=0 ; indexNombreRanger < nombreRanger.length ; indexNombreRanger++ ){ // elle regardes tous les indexes du tableau du bas

            let nombreDuBas = nombreRanger[indexNombreRanger]

            if(nombreDuBas < nombreARanger){

                nombreEstRange = true
                nombreRanger.splice(indexNombreRanger, 0, nombreARanger);
                utilisateurRanger.splice(indexNombreRanger, 0, utilisateurARanger[indexNombreARanger]);
                
                break
            }
        }

        if(nombreEstRange == false){
            nombreRanger.push(nombreARanger)
            utilisateurRanger.push(utilisateurARanger[indexNombreARanger])
        }

    }

    return {nombreRanger: nombreRanger,utilisateurRanger: utilisateurRanger}
}

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
    
    if (interaction.commandName === 'setchannelinvitation') {
        const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('setchannelinvitation')
                                .setDescription(`Voici le Channel où il y aura les nouveaux arrivants avec les personnes qui les ont invité.`)
                               
                             await interaction.reply({embeds: [embded5]})
        
        let _channelid = interaction.channelId
        let _guildid = interaction.guildId
        channelId[_guildid] = _channelid
        fs.writeJSONSync("FichierJson/channel.json", channelId)
    }

    if (interaction.commandName === 'setchannelbump') {
        const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('setchannelbump')
                                .setDescription(`Voici le Channel où il y aura les ping pour faire les bumps`)
                               
                             await interaction.reply({embeds: [embded5]})
        
        let _ChannelBump = interaction.channelId
        let _guildid = interaction.guildId
        ChannelBump[_guildid] = _ChannelBump
        console.log(ChannelBump)
        fs.writeJSONSync("FichierJson/channelbump.json", ChannelBump)
    }
    
    if (interaction.commandName === 'setrolebump') {

        let _Role = interaction.options.get('role').value
        let _guildid = interaction.guildId
        Role[_guildid] = _Role

        fs.writeJSONSync("FichierJson/Role.json", Role)

        const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('setrolebump')
                                .setDescription(`Voici le role qui sera ping : <@&${_Role}>`)
                               
                             await interaction.reply({embeds: [embded5]})
        
    }

    if (interaction.commandName === 'help') {
        const embded = new EmbedBuilder()
            .setColor(0x43EA57)
            .setTitle('Liste des commandes')
            .setDescription(`\`/setchannelinvitation\` : Permet d'initialiser le channel des nouveaux arrivants\n
            \`setchannelbump\` : Permet d'initialiser le channel pour rappeler de faire le Bump\n
            \`setrolebump\` : Permet de séléctionner le rôle à ping pour les bumps\n
            \`/weekbump\` : Permet de voir le nombre de Bumps qu'une personne à fait + le nombre de Bump de cette semaine\n
            \`/rankingbump\` : Classement des meilleurs Bumpbers + meilleurs Bumpers de la semaine passée\n
            \`/invitation\` : Permet de voir le nombre total d'invitation + combien ont quitté le serveur`)
        await interaction.reply({embeds: [embded]})
    }

    if (interaction.commandName === 'weekbump') { 
        let _guildid = interaction.guildId
        let pseudo = interaction.options.get('pseudo');
        
        let firstDay = 1668380400 - 604800 // Seconde
        let date = Date.now() / 1000 // Milliseconde
        let tempsEcoule = date - firstDay
        let semaineID = tempsEcoule / 604800
        semaineID = (Math.trunc(semaineID))

        const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Bump')
                                .setDescription(`${pseudo.member.user.username} a effectué ${getTotalBump(_guildid, pseudo.value)} Bump au Total ! \nIl a effectué un Total de ${getWeeklyBump(_guildid, semaineID, pseudo.value)} Bump cette semaine`)
                               
                             await interaction.reply({embeds: [embded5]})
      
    }

    if (interaction.commandName === 'invitation') { 
        let _guildid = interaction.guildId
        const pseudo = interaction.options.get('pseudo');

        console.log(pseudo)


        const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Invitation')
                                .setDescription(`${pseudo.member.user.username} a effectué un Total de ${getNombreInvitation(_guildid,  pseudo.user.id)} invitations\nPuis ${getNombreInvitationRemove(_guildid, pseudo.user.id )} personnes sont partis`)
                               
                             await interaction.reply({embeds: [embded5]})
    
    }


    if (interaction.commandName === 'rankingbump') { 
        let _guildid = interaction.guildId 
        
        let firstDay = 1668380400 - 604800 // Seconde
        let date = Date.now() / 1000 // Milliseconde
        let tempsEcoule = date - firstDay
        let semaineID = tempsEcoule / 604800
        semaineID = (Math.trunc(semaineID))
        let lastWeek = semaineID - 1
        
        if (NombreBumpWeek[_guildid] == undefined) {
            NombreBumpWeek[_guildid] = {}
        }

        if (NombreBumpWeek[_guildid][lastWeek] == undefined) {
            NombreBumpWeek[_guildid][lastWeek] = {}
        }

         if (NombreBump[_guildid] == undefined) {
            NombreBump[_guildid] = {}
        }

        const { nombreRanger: nombreRangerTotal, utilisateurRanger: utilisateurRangerTotal } = sortArray(NombreBump[_guildid])
        const { nombreRanger: nombreRangerWeek, utilisateurRanger: utilisateurRangerWeek } = sortArray(NombreBumpWeek[_guildid][lastWeek])


        console.log(utilisateurRangerTotal)

        let rankUser1 = client.users.cache.find(user => user.id === utilisateurRangerTotal[0])
        let rankUser2 = client.users.cache.find(user => user.id === utilisateurRangerTotal[1])
        let rankUser3 = client.users.cache.find(user => user.id === utilisateurRangerTotal[2])
        let rankUser4 = client.users.cache.find(user => user.id === utilisateurRangerTotal[3])
        let rankUser5 = client.users.cache.find(user => user.id === utilisateurRangerTotal[4])

        let rankUserWeek1 = client.users.cache.find(user => user.id === utilisateurRangerWeek[0])
        let rankUserWeek2 = client.users.cache.find(user => user.id === utilisateurRangerWeek[1])
        let rankUserWeek3 = client.users.cache.find(user => user.id === utilisateurRangerWeek[2])
        let rankUserWeek4 = client.users.cache.find(user => user.id === utilisateurRangerWeek[3])
        let rankUserWeek5 = client.users.cache.find(user => user.id === utilisateurRangerWeek[4])

        let Message = " Il n'y a pas d'utilisateur"
       
                                        
        if(rankUser1 != undefined){
            Message =  `CLASSEMENT TOTAL BUMP :\n \n1er : ${rankUser1.username} avec ${nombreRangerTotal[0]} Bump au Total`      
        }
            
        if(rankUser2 != undefined){
            Message = Message+ `\n2e : ${rankUser2.username} avec ${nombreRangerTotal[1]} Bump au Total`       
        }

        if(rankUser3 != undefined){
            Message = Message+ `\n3e : ${rankUser3.username} avec ${nombreRangerTotal[2]} Bump au Total`     
        }

        if(rankUser4 != undefined){
            Message = Message+ `\n4e : ${rankUser4.username} avec ${nombreRangerTotal[3]} Bump au Total`     
        }

        if(rankUser5 != undefined){
            Message = Message+ `\n5e : ${rankUser5.username} avec ${nombreRangerTotal[4]} Bump au Total`     
        }


        if(rankUserWeek1 != undefined){
            Message = Message+ `\n \nCLASSEMENT TOTAL BUMP (SEMAINE DERNIERE)\n \n1er : ${rankUser1.username} avec ${nombreRangerWeek[0]} Bump`  
        }

        if(rankUserWeek2 != undefined){
            Message = Message+ `\n2e : ${rankUserWeek2.username} avec ${nombreRangerWeek[1]} Bump`  
        }

        if(rankUserWeek3 != undefined){
            Message = Message+ `\n3e : ${rankUserWeek3.username} avec ${nombreRangerWeek[2]} Bump`  
        }

        if(rankUserWeek4 != undefined){
            Message = Message+ `\n4e : ${rankUserWeek4.username} avec ${nombreRangerWeek[3]} Bump`  
        }

        if(rankUserWeek5 != undefined){
            Message = Message+ `\n5e : ${rankUserWeek5.username} avec ${nombreRangerWeek[4]} Bump`  
        }

    const embded5 = new EmbedBuilder()
        .setColor(0x43EA57)
        .setTitle('🏆 CLASSEMENT 🏆')
        .setDescription(Message)
       
     await interaction.reply({embeds: [embded5]})
    
    }

});

client.on('messageCreate', async message => {
    if(message.author.id == "302050872383242240") {
        
        if(message.interaction.commandName === 'bump'){
            
            let _guildid = message.guildId
            let _TotalBump = getTotalBump(_guildid, message.interaction.user.id)
            
            NombreBump[_guildid][message.interaction.user.id] = _TotalBump+ 1          
            
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)
        
            let firstDay = 1668380400 - 604800 // Seconde
            let date = Date.now() / 1000 // Milliseconde
            let tempsEcoule = date - firstDay
            let semaineID = tempsEcoule / 604800
            semaineID = (Math.trunc(semaineID))

            let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.interaction.user.id)

            NombreBumpWeek[_guildid][semaineID][message.interaction.user.id] = _WeeklyBump + 1 
            fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            let channel = getRoleChannel(_guildid)
            setTimeout(function() {
                const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Ping Bump')
                                .setDescription(`⏰ DRINNG\n\n**C'est l'heure du Bump !**\n<@&${Role[_guildid]}>`)
                               
                              channel.send({embeds: [embded5], content: `||<@&${Role[_guildid]}>||`})
                
              }, 7200000);
        }
    }
});

client.on("guildCreate", (guild) => {
    guild.invites.fetch().then(guildInvites => {
      invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    })
});

client.on("inviteDelete", (invite) => {
    invites.get(invite.guild.id).delete(invite.code);
  });

client.on("guildDelete", (guild) => {
    invites.delete(guild.id);
});

client.on("inviteCreate", (invite) => {
    invites.get(invite.guild.id).set(invite.code, invite.uses);
    console.log("inviteCreate")
  });

client.on('guildMemberAdd', async member => {
    let channel = getServerChannel(member.guild.id)

    let newInvites = await member.guild.invites.fetch()
    let oldInvites = invites.get(member.guild.id);
    let invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
    const inviter = await client.users.fetch(invite.inviter.id);
    
    inviter
        ? channel.send(`${member.user} Bienvenue sur ${member.guild.name} ! Tu as été invité par ${inviter}.`)
        : channel.send(`${member.user.tag} a rejoint mais je n'ai pas trouvé par quelle invitation.`)


    invites.set(member.guild.id, new Map(newInvites.map((invite) => [invite.code, invite.uses])));

    let _guildid = member.guild.id
    let _inviteur = inviter.id
    let _NombreInvitation = getNombreInvitation(_guildid,_inviteur)
    
    NombreInvitation[_guildid][_inviteur] = _NombreInvitation + 1 
    fs.writeJSONSync("FichierJson/Invite.json", NombreInvitation)

    let _inviter = member.user.id
    getNombreInvitationRemove(_guildid, _inviteur )
    fs.writeJSONSync("FichierJson/InviterPartit.json", NombreInvitationRemove)

    getPersonneAyantInvitee(_guildid, _inviter)
    PersonneAyantInvitee[_guildid][_inviter] = _inviteur
    fs.writeJSONSync("FichierJson/PersonneAyantInvitee.json", PersonneAyantInvitee)
});

client.on('guildMemberRemove', async member => {

    let _guildid = member.guild.id
    let _inviter = member.user.id
    
    let _PersonneAyantInvitee = getPersonneAyantInvitee(_guildid, _inviter)
    let _NombreInvitationRemove =  getNombreInvitationRemove(_guildid, _PersonneAyantInvitee )
    NombreInvitationRemove[_guildid][_PersonneAyantInvitee] = _NombreInvitationRemove +1
    console.log(_NombreInvitationRemove)

    
    fs.writeJSONSync("FichierJson/InviterPartit.json", NombreInvitationRemove)

    
  });
client.login(TOKEN);
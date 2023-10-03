const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes,EmbedBuilder,PermissionFlagsBits, Collection } = require("discord.js");
const fs = require("fs-extra")
require('dotenv').config()

let NombreBump = fs.readJSONSync("FichierJson/NombreBump.json")
let NombreBumpWeek = fs.readJSONSync("FichierJson/BumpWeek.json")
let ChannelBump = fs.readJSONSync("FichierJson/channelbump.json")
let Role = fs.readJSONSync("FichierJson/Role.json")
let MessageAutoRole = fs.readJSONSync("FichierJson/autorole.json")
let Xp = fs.readJSONSync("FichierJson/Xp.json")
let Autorole = fs.readJSONSync("FichierJson/AutoRole1.json")
let NombreInvitation = fs.readJSONSync("FichierJson/Invite.json")
let NombreInvitationRemove = fs.readJSONSync("FichierJson/InviterPartit.json")
let PersonneAyantInvitee = fs.readJSONSync("FichierJson/PersonneAyantInvitee.json")

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

const TOKEN = process.env.TOKEN
const ID = process.env.ID

client.on("ready", () => {
    console.log("bot opéationnel");

    client.guilds.cache.forEach(async (guild) => {
        // Fetch all Guild Invites
        const firstInvites = await guild.invites.fetch();
        // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
        invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    });

})

    const _cminvitation = new SlashCommandBuilder()
    .setName('invitation')
    .setDescription('Nombre Total dinvitation')
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )

const _setautorole = new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Envoie le message avec réaction pour avoir le rôle')
    .addRoleOption((option) =>
        option.setName("role1")
        .setDescription('ping le role')
        .setRequired(true)
    )
    .addRoleOption((option) =>
        option.setName("role2")
        .setDescription('ping le role')
        .setRequired(true)
    )
    .addRoleOption((option) =>
        option.setName("role3")
        .setDescription('ping le role')
        .setRequired(true)
    )

const _setpub = new SlashCommandBuilder()
    .setName('setpub')
    .setDescription('Envoie le message pour les échanges de pubs')
    
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

const _setrolebump = new SlashCommandBuilder()
    .setName('setrolebump')
    .setDescription('Permet de séléctionner le rôle à ping pour les bumps ')
    .addRoleOption((option) =>
        option.setName("role")
        .setDescription('ping le role')
        .setRequired(true)
    )    

const _setchannelbump = new SlashCommandBuilder()
    .setName('setchannelbump')
    .setDescription('Création du Channel pour ping de faire un bump')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const _help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Liste des commandes')      

const commands = [

_setpub,
_weekbump,
_rankingbump,
_setrolebump,
_setchannelbump,
_help,
_setautorole,
_cminvitation,

];

const getTotalBump = (guildId, userId) => {
    if(NombreBump[guildId] === undefined){  
        NombreBump[guildId] = {}
    }
    
    if(NombreBump[guildId][userId] === undefined){  
        NombreBump[guildId][userId] = 0
    }

    return NombreBump[guildId][userId] 
}

const getAutoRol = (guildId) => {
    if(MessageAutoRole[guildId] === undefined){  
        MessageAutoRole[guildId] = ""
    }
    return MessageAutoRole[guildId]
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

const getWeeklyBump = (guildId, weekId, userId) => {
    if(NombreBumpWeek[guildId] === undefined){  
        NombreBumpWeek[guildId] = {}
    }
    
    if(NombreBumpWeek[guildId][weekId] === undefined) {
        NombreBumpWeek[guildId][weekId] = {}
    }
1
    if(NombreBumpWeek[guildId][weekId][userId] === undefined){  
        NombreBumpWeek[guildId][weekId][userId] = 0
    }

    return NombreBumpWeek[guildId][weekId][userId] 
}

const getAutoRole = (guildId) => {
    if(Autorole[guildId] === undefined){
        Autorole[guildId] = {
            Role1 : "",
            Role2 : "",
            Role3 : ""
        }
    }
 
    return Autorole[guildId]
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

const getXp = (guildId, userId) => {    
    if(Xp[guildId]  === undefined){  
        Xp[guildId]  = {}
    }


    if(Xp[guildId][userId] === undefined){  
        Xp[guildId][userId] = 0
    }

    return Xp[guildId][userId]
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
    
        await rest.put(Routes.applicationCommands(ID), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        
        try{
            if (interaction.commandName === 'setpub') {

                if (interaction.member.permissions.has("ADMINISTRATOR")) {
                    
                    const embded5 = new EmbedBuilder()
                    .setColor([5, 5, 94])
                    .setTitle(`🚀・ __SpaceCraft__`)
                    .setDescription(`**\`CONDITIONS D'ECHANGE DE PUB\`**\n\n
                    **__50-300 Membres__ = Mention __partenariat__ pour nous deux**\n\n
                    **__300-++ Membres__ = Mention __here__ pour nous et __partenariat__**\n\n
                    **\`PARTENARIATS\`**\n\n
                    **Pour les __partenariats__, il faut que nos deux serveurs se communiquent entre eux __régulièrement__ ! Pas tous les jours bien évidemment, mais que chacun se tienne au courant des __nouveautés__ et des __projets__ que les autres veulent faire. Cet accord est sérieux ! Chaque serveur doit montrer de la __maturité__ et des __responsabilité__. Plus d'infos en ticket.**
                    `)
                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                    
                    await interaction.reply({embeds: [embded5]})

                    
                }
            }

            if (interaction.commandName === 'setchannelbump') {
                const embded5 = new EmbedBuilder()
                    .setColor([5, 5, 94])
                    .setTitle('setchannelbump')
                    .setDescription(`Voici le Channel où il y aura les ping pour faire les bumps`)
                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')

                await interaction.reply({embeds: [embded5]})
                
                let _ChannelBump = interaction.channelId
                let _guildid = interaction.guildId
                ChannelBump[_guildid] = _ChannelBump
                fs.writeJSONSync("FichierJson/channelbump.json", ChannelBump)
            }

            if (interaction.commandName === 'setrolebump') {

                let _Role = interaction.options.get('role').value
                let _guildid = interaction.guildId
                Role[_guildid] = _Role
        
                fs.writeJSONSync("FichierJson/Role.json", Role)
        
                const embded5 = new EmbedBuilder()
                    .setColor([5, 5, 94])
                    .setTitle('🎈・Role')
                    .setDescription(`**Voici le role qui sera ping :** <@&${_Role}>`)
                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                    
                await interaction.reply({embeds: [embded5]})
                
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
                    .setColor([5, 5, 94])
                    .setTitle('🎈・Bump')
                    .setDescription(`**${pseudo.member.user.username}** a effectué **${getTotalBump(_guildid, pseudo.value)}** Bump au **Total** ! \nIl a effectué un Total de **${getWeeklyBump(_guildid, semaineID, pseudo.value)}** Bump cette semaine`)
                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')

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
                    Message =  `**CLASSEMENT TOTAL BUMP**\n \n1er : **${rankUser1.username}** avec **${nombreRangerTotal[0]}** Bump au Total`      
                }
                    
                if(rankUser2 != undefined){
                    Message = Message+ `\n2e : **${rankUser2.username}** avec **${nombreRangerTotal[1]}** Bump au Total`       
                }
        
                if(rankUser3 != undefined){
                    Message = Message+ `\n3e : **${rankUser3.username}** avec **${nombreRangerTotal[2]}** Bump au Total`     
                }
        
                if(rankUser4 != undefined){
                    Message = Message+ `\n4e : **${rankUser4.username} avec **${nombreRangerTotal[3]}** Bump au Total`     
                }
        
                if(rankUser5 != undefined){
                    Message = Message+ `\n5e : **${rankUser5.username} avec **${nombreRangerTotal[4]}** Bump au Total`     
                }
        
        
                if(rankUserWeek1 != undefined){
                    Message = Message+ `\n \n**CLASSEMENT TOTAL BUMP (SEMAINE DERNIERE)**\n \n1er : **${rankUser1.username}** avec **${nombreRangerWeek[0]}** Bump`  
                }
        
                if(rankUserWeek2 != undefined){
                    Message = Message+ `\n2e : **${rankUserWeek2.username}** avec **${nombreRangerWeek[1]}** Bump`  
                }
        
                if(rankUserWeek3 != undefined){
                    Message = Message+ `\n3e : **${rankUserWeek3.username}** avec **${nombreRangerWeek[2]}** Bump`  
                }
        
                if(rankUserWeek4 != undefined){
                    Message = Message+ `\n4e : **${rankUserWeek4.username}** avec **${nombreRangerWeek[3]}** Bump`  
                }
        
                if(rankUserWeek5 != undefined){
                    Message = Message+ `\n5e : **${rankUserWeek5.username}** avec **${nombreRangerWeek[4]}** Bump`  
                }
        
            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle('🏆 __CLASSEMENT__ 🏆')
                .setDescription(Message)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
               
             await interaction.reply({embeds: [embded5]})
            
            }

            if (interaction.commandName === 'help') {
                const embded = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle('Liste des commandes')
                .setDescription(`\`/weekbump\` : Permet de voir le nombre de Bumps qu'une personne à fait + le nombre de Bump de cette semaine\n
                \`/rankingbump\` : Classement des meilleurs Bumpbers + meilleurs Bumpers de la semaine passée\n
                `)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
            await interaction.reply({embeds: [embded]})
            }

            if (interaction.commandName === 'invitation') { 
                let _guildid = interaction.guildId
                const pseudo = interaction.options.get('pseudo');
        
        
                const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle('📫・Invitations')
                .setDescription(`**${pseudo.member.user.username} a effectué un Total de ${getNombreInvitation(_guildid,  pseudo.user.id)} invitation(s)**\n**Un Total de ${getNombreInvitationRemove(_guildid, pseudo.user.id )} personne(s) sont/est parti(e)(s)**`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')

                await interaction.reply({embeds: [embded5]})
            
            }

            if (interaction.commandName === 'setautorole') {

                if (interaction.member.permissions.has("ADMINISTRATOR")) {
                    let _Role = interaction.options.get('role1').value
                    let _Role1 = interaction.options.get('role2').value
                    let _Role2 = interaction.options.get('role3').value
                    
                    const embded5 = new EmbedBuilder()
                    .setColor([5, 5, 94])
                    .setTitle(`🚀・ __SpaceCraft__`)
                    .setDescription(`**Rôles**\n
                    **<@&${_Role}> : Mention Pour les Bumps !**\n
                    **<@&${_Role1}> : Mention Pour les Giveways !**\n
                    **<@&${_Role2}> : Mention Pour les Partenariats !**`)
                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                    
                    await interaction.reply({embeds: [embded5]})
                    

                    const message = await interaction.channel.messages.fetch({ limit: 1 })
                    let lastMessage = message.first();
                                      
                    guildId = interaction.guild.id
                    
                    MessageAutoRole[guildId] = lastMessage.id
                    fs.writeJSONSync("FichierJson/autorole.json", MessageAutoRole)


                    getAutoRole(guildId)
                    Autorole[guildId].Role1 = _Role
                    Autorole[guildId].Role2 = _Role1
                    Autorole[guildId].Role3 = _Role2
                    fs.writeJSONSync("FichierJson/AutoRole1.json", Autorole)
                }
                const message = await interaction.fetchReply();
                message.react('🎈');
                message.react('🎉');
                message.react('🤝');

            }

        }

        catch (error) {
            console.log(error);
         }

    })

    client.on('messageReactionAdd', async(reaction, user) => {
        let guildId = reaction.message.guild.id

        let Role1_ = getAutoRole(guildId).Role1
        let Role2_ = getAutoRole(guildId).Role2
        let Role3_ = getAutoRole(guildId).Role3

        if(reaction.emoji.name === "🎈" && reaction.message.id === getAutoRol(guildId)) {

            const member = reaction.message.guild.members.cache.get(user.id);

            const role = reaction.message.guild.roles.cache.get(Role1_);
            member.roles.add(role)

        };

        if(reaction.emoji.name === "🎉" && reaction.message.id === getAutoRol(guildId)) {

            const member = reaction.message.guild.members.cache.get(user.id);

            const role = reaction.message.guild.roles.cache.get(Role2_);
            member.roles.add(role)

        };

        if(reaction.emoji.name === "🤝" && reaction.message.id === getAutoRol(guildId)) {

            const member = reaction.message.guild.members.cache.get(user.id);

            const role = reaction.message.guild.roles.cache.get(Role3_);
            member.roles.add(role)

        };

    })

    client.on('messageReactionRemove', async(reaction, user) => {

        let guildId = reaction.message.guild.id

        let Role1_ = getAutoRole(guildId).Role1
        let Role2_ = getAutoRole(guildId).Role2
        let Role3_ = getAutoRole(guildId).Role3

        if(reaction.emoji.name === "🎈" && reaction.message.id === getAutoRol(guildId)) {


            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(Role1_);
            member.roles.remove(role)
        };

        if(reaction.emoji.name === "🎉" && reaction.message.id === getAutoRol(guildId)) {

            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(Role2_);
            member.roles.remove(role)
        };

        if(reaction.emoji.name === "🤝" && reaction.message.id === getAutoRol(guildId)) {


            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(Role3_);
            member.roles.remove(role)
        };

    })

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
                                    .setColor([5, 5, 94])
                                    .setTitle('Ping Bump')
                                    .setDescription(`⏰** DRINNG**\n\n**C'est l'heure du **Bump** !**\n<@&${Role[_guildid]}>`)
                                    .setImage('https://zupimages.net/up/22/52/trc9.png')
                                    .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')

                                  channel.send({embeds: [embded5], content: `||<@&${Role[_guildid]}>||`})
                    
                  }, 7200000);
            }
        }

        let _guildId = message.guild.id
        let _userId = message.author.id
        let _guildid = message.guild.id

        if(message.author.bot === false){

            let _Xp = getXp(_guildId, _userId)
            Xp[_guildId][_userId] = _Xp + 5
            fs.writeJSONSync("FichierJson/Xp.json",  Xp )     
        }
        
        if(getXp(_guildId, _userId) == 50){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 2 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 100){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 3 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 200){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 4 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 300){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 5 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 400){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 6 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 500){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 7 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 650){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 8 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 800){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 9 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }

        if(getXp(_guildId, _userId) == 1000){

            
            let _TotalBump = getTotalBump(_guildid, message.author.id)
            NombreBump[_guildid][message.author.id] = _TotalBump+ 1          
                
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)

            let firstDay = 1668380400 - 604800 // Seconde
                let date = Date.now() / 1000 // Milliseconde
                let tempsEcoule = date - firstDay
                let semaineID = tempsEcoule / 604800
                semaineID = (Math.trunc(semaineID))
    
                let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.author.id)
    
                NombreBumpWeek[_guildid][semaineID][message.author.id] = _WeeklyBump + 1 
                fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            const embded5 = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 10 ! ✨`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')
                
                await message.reply({embeds: [embded5]})

        }


    });


    client.on('guildMemberAdd', async member => {
        
        let newInvites = await member.guild.invites.fetch()
        let oldInvites = invites.get(member.guild.id);
        let invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
        const inviter = await client.users.fetch(invite.inviter.id);


        invites.set(member.guild.id, new Map(newInvites.map((invite) => [invite.code, invite.uses])));

        let embded

        invite ?  
            
            embded = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle('✉️・ __Invitation__')
                .setDescription(`**・${member.user} Bienvenue sur ${member.guild.name} !\n\n ・Tu as été invité par ${inviter}.**\n`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')               
        : 
            embded = new EmbedBuilder()
                .setColor([5, 5, 94])
                .setTitle('✉️・ __Invitation__')
                .setDescription(`**${member.user.tag} a rejoint, mais je n'ai pas trouvé par quelle invitation.**\n`)
                .setImage('https://zupimages.net/up/22/52/trc9.png')
                .setThumbnail('https://zupimages.net/up/22/52/qzcv.png')  

        client.channels.cache.get(`1068737228748095540`).send({embeds: [embded]})

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
    
        
        fs.writeJSONSync("FichierJson/InviterPartit.json", NombreInvitationRemove)
    
        
      });

      client.on('error', (err) => {
        console.log(err.message)
     });

client.login(TOKEN);
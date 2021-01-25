const config = require("./config.json");
import * as Discord from "discord.js";
import { 
  extractNumbersForId,
  returnIdArrayFromArgs
} from "./botCommands/Utilities/argUtils";
import {
  memberHasAnyRoleByName,
} from "./botCommands/Utilities/roleUtils";
import {
  postBoostInfoCommand,
  joinCommand,
  checkPFPCommand,
  kickUserCommand,
  banUserCommand,
  replaceAllRolesCommand,
  howManyAreCommand,
  whoIsCommand,
  quarantineCommand,
  unQuarantineCommand,
  warnCommand,
  msgCommand,
  dmsgCommand
} from "./botCommands/botCommands";

const client = new Discord.Client();
client.login(config.BOT_TOKEN);
const prefix = "=";
const serverId = config.SERVER_ID; // Swan Hatchery ID
const VIPRoleList = config.VIPRoleList
const botPermissionsRoleList = config.botPermissionsRoleList

export const isMemberVIP = (inputMember:Discord.GuildMember): boolean => {
  return memberHasAnyRoleByName(inputMember, VIPRoleList);
};

let messageHasBotPermissions = (inputMessage:Discord.Message):boolean => {
  let messagerIsBot = inputMessage.author.bot 
  if (messagerIsBot) {
    return false;
  }

  let messagerHasBotPermissions = memberHasAnyRoleByName(inputMessage.member,botPermissionsRoleList)
  if (!messagerHasBotPermissions){
    return false;
  }

  let messageStartsWithCommandPrefix = inputMessage.content.startsWith(prefix)
  if (!messageStartsWithCommandPrefix){
    return false;
  }

  return true;
}

console.log("The swans have been released!");

client.on("message", function (currentMessage) {//takes a message object as input
  if (!messageHasBotPermissions(currentMessage)){return}
  const fetchCurrentGuildObject:Promise<Discord.Guild> = client.guilds.fetch(serverId);

  const commandBody:string = currentMessage.content.slice(prefix.length);
  const args:string[] = commandBody.split(" ");
  const command:string = args.shift().toLowerCase();

  let firstArgId:string = extractNumbersForId(args[0]);
  let reasonForModeration:string = args.slice(1, 9999).join(" ");
  

async function executeBotCommands (command:string) {
  let currentGuildObject:Discord.Guild = await fetchCurrentGuildObject

  let lengthOfArgs:number = args.length
  switch(lengthOfArgs){
  case(0):
    zeroArgumentBotCommands(currentGuildObject, command)
    break;
  case(1):
    oneArgumentBotCommands(currentGuildObject, command)
    arbitraryArgumentBotCommands(currentGuildObject, command);
    break;
  case(2): 
    oneArgumentBotCommands(currentGuildObject, command) // To account for reasonmessage
    twoArgumentBotCommands(currentGuildObject, command)
    arbitraryArgumentBotCommands(currentGuildObject, command);
    break;
  default:
    arbitraryArgumentBotCommands(currentGuildObject, command);
    break;
  }
}

executeBotCommands(command);

async function zeroArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput) {

  switch(commandInput){
      case "help":
        currentMessage.channel.send(`=help | Show list of commands
        =boostinfo | Show server's boost info
        =checkpfp | Applies 'Default PFP' role to users with default PFP
        =join @user | Show when user joined Discord, and this Server
        =kick @user | Kick a user
        =ban @user | Ban a user
        =quarantine @user | Applies quarantine role
        =unquarantine @user | Removes quarantine role
        =warn @user | Warn a user. If warned twice, user is banned.
        =msg #channel message | Sends message to channel
        =dmsg @user message | DM message to user
        =replaceall @roleA @roleB | Replaces all roleA with roleB
        =howmanyare @role @role .. | Show number of users with listed roles
        =whois @role @role .. | Lists users by name with listed roles`)
        break;

      case "boostinfo": // =boostinfo
        postBoostInfoCommand(inputGuildObject,currentMessage);
        break;
        
      case "checkpfp": // =checkpfp
        checkPFPCommand(inputGuildObject);
        break;
    }
}

async function oneArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput) {

  switch (commandInput) {
  case "join": // =join @user
    let joinTestUser:string = firstArgId;
    joinCommand(inputGuildObject,joinTestUser,currentMessage)
    break;

  case "kick": // =kick @user
    let kickedUserId:string = firstArgId;
    kickUserCommand(inputGuildObject, kickedUserId, currentMessage, reasonForModeration)
    break;

  case "ban": // =ban @user
    let bannedUserId:string = firstArgId;
    banUserCommand(inputGuildObject, bannedUserId, currentMessage, reasonForModeration)
    break;

  case "quarantine": // =quarantine @user
    let quarantinedUserId:string = firstArgId;
    quarantineCommand(inputGuildObject, quarantinedUserId, currentMessage, reasonForModeration)
    break;

  case "unquarantine": // =unquarantine @user
    let unquarantinedUserId:string = firstArgId;
    unQuarantineCommand(inputGuildObject, unquarantinedUserId, currentMessage, reasonForModeration)
    break;

  case "warn": // =warn @user
// Three-stage warning system. 
// If no warned role, add "Warned" role. 
// If has "Warned", remove "Warned", add "Warned Twice". 
// If "Warned Twice", ban.
    let warnedUserId:string = firstArgId
    warnCommand(inputGuildObject,warnedUserId,currentMessage,reasonForModeration)
    break;
  }

}

async function twoArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput) {

  switch (commandInput) {

    case `msg`: // =msg #channel message
      let targetChannelId:string = extractNumbersForId(args[0]);
      msgCommand(inputGuildObject,targetChannelId,currentMessage,reasonForModeration)
      break;

    case `dmsg`: // =dmsg @user message
      let targetUserId:string = firstArgId;
      dmsgCommand(inputGuildObject,targetUserId,currentMessage,reasonForModeration)
      break;

    case "replaceall": // =replaceall @roleA @roleB
      let replacedRoleId:string = extractNumbersForId(args[0]);
      let newRoleId:string = extractNumbersForId(args[1]);
      replaceAllRolesCommand(inputGuildObject, replacedRoleId, newRoleId)
      break;
    }
}

async function arbitraryArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput) {
  let inputIDs:string[] = returnIdArrayFromArgs(args)

    switch(commandInput){
      
      case "howmanyare": // =howmanyare @role @role .. etc
        howManyAreCommand(inputGuildObject, inputIDs, currentMessage)
        break;

      case "whois": // =whois @role @role .. etc
        whoIsCommand(inputGuildObject, inputIDs, currentMessage)
        break;
      }
    }

  }
);

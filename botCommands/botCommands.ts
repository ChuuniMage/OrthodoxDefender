import * as Discord from "discord.js";
import { 
  extractTokens,
  extractNumbersForId,
  returnIdArrayFromArgs
} from "./Utilities/argUtils";
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
} from "./rawBotCommands/rawBotCommands";

export let zeroArgCommandArray:string[] = ["help","boostinfo","checkpfp"];

export async function zeroArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput:string, inputMessage:Discord.Message) {

  switch(commandInput){
      case "help":
        inputMessage.channel.send(`=help | Show list of commands
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
        postBoostInfoCommand(inputGuildObject,inputMessage);
        break;
        
      case "checkpfp": // =checkpfp
        checkPFPCommand(inputGuildObject);
        break;
    }
}

export let oneArgCommandArray:string[] = ["join","kick","ban","quarantine","unquarantine","warn", "msg","dmsg"];

export async function oneArgumentBotCommands(inputGuildObject:Discord.Guild, commandInput:string, arg1:string, 
  messageToPost:string, inputMessage:Discord.Message) {
  
  switch (commandInput) {
  case "join": // =join @user
    let joinTestUser:string = extractNumbersForId(arg1);
    joinCommand(inputGuildObject,joinTestUser,inputMessage)
    break;

  case "kick": // =kick @user
    let kickedUserId:string = extractNumbersForId(arg1);
    kickUserCommand(inputGuildObject, kickedUserId, inputMessage, messageToPost)
    break;

  case "ban": // =ban @user
    let bannedUserId:string = extractNumbersForId(arg1);
    banUserCommand(inputGuildObject, bannedUserId, inputMessage, messageToPost)
    break;

  case "quarantine": // =quarantine @user
    let quarantinedUserId:string = extractNumbersForId(arg1);
    quarantineCommand(inputGuildObject, quarantinedUserId, inputMessage, messageToPost)
    break;

  case "unquarantine": // =unquarantine @user
    let unquarantinedUserId:string = extractNumbersForId(arg1);
    unQuarantineCommand(inputGuildObject, unquarantinedUserId, inputMessage, messageToPost)
    break;

  case "warn": // =warn @user
// Three-stage warning system. 
// If no warned role, add "Warned" role. 
// If has "Warned", remove "Warned", add "Warned Twice". 
// If "Warned Twice", ban.
    let warnedUserId:string = extractNumbersForId(arg1)
    warnCommand(inputGuildObject,warnedUserId,inputMessage,messageToPost)
    break;

  case `msg`: // =msg #channel message
    let targetChannelId:string = extractNumbersForId(arg1);
    msgCommand(inputGuildObject,targetChannelId, inputMessage, messageToPost)
    break;

  case `dmsg`: // =dmsg @user message
    let targetUserId:string = extractNumbersForId(arg1);
    dmsgCommand(inputGuildObject,targetUserId, inputMessage, messageToPost)
    break;
  }

}

export let twoArgCommandArray:string[] = ["replaceall"]

export  async function twoArgumentBotCommands(inputGuildObject:Discord.Guild,  commandInput:string, arg1:string, arg2:string, inputMessage:Discord.Message) {

  switch (commandInput) {

    case "replaceall": // =replaceall @roleA @roleB
      let replacedRoleId:string = extractNumbersForId(arg1);
      let newRoleId:string = extractNumbersForId(arg2);
      replaceAllRolesCommand(inputGuildObject, replacedRoleId, newRoleId)
      break;
    }
}

export let arbitraryArgCommandArray:string[] = ["howmanyare","whois"]

export async function arbitraryArgumentBotCommands(inputGuildObject:Discord.Guild, 
  commandInput:string, 
  inputTokens:string[], 
  inputMessage:Discord.Message) {

  let inputIDs:string[] = extractTokens(returnIdArrayFromArgs(inputTokens).join(" "))
  
    switch(commandInput){
      
      case "howmanyare": // =howmanyare @role @role .. etc
        howManyAreCommand(inputGuildObject, inputIDs, inputMessage)
        break;

      case "whois": // =whois @role @role .. etc
        whoIsCommand(inputGuildObject, inputIDs, inputMessage)
        break;
      }
    }
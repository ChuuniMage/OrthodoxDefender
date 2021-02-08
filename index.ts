const config = require("./config.json");
import * as Discord from "discord.js";
import { 
  extractTokens,
  returnCommandType
} from "./botCommands/Utilities/argUtils";
import {
  memberHasAnyRoleByName,
} from "./botCommands/Utilities/roleUtils";
import {
  zeroArgumentBotCommands,
  oneArgumentBotCommands,
  twoArgumentBotCommands,
  arbitraryArgumentBotCommands
} from "./botCommands/botCommands"

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
  const commandTokens:string[] = extractTokens(currentMessage.content);
  const command:string = commandTokens[0].replace(prefix,"").toLowerCase();

let executeBotCommands = async (inputCommand:string) => {
  let currentGuildObject:Discord.Guild = await fetchCurrentGuildObject
  let arg1 = commandTokens[1]
  let arg2 = commandTokens[2]
  switch(returnCommandType(command)){
    case"Invalid":
      return;
    case"zero":
      zeroArgumentBotCommands(currentGuildObject, command, currentMessage)
      break;
    case"one":
      let reasonForModeration:string = commandTokens.slice(2, 9999).join(" ");
      oneArgumentBotCommands(currentGuildObject, command, arg1, reasonForModeration, currentMessage)
      break;
    case"two":
      twoArgumentBotCommands(currentGuildObject, command, arg1, arg2, currentMessage)
      break;
    case"arbitrary":
    let arbitraryArgs = commandTokens.slice(1,9999)
      arbitraryArgumentBotCommands(currentGuildObject, command, arbitraryArgs, currentMessage)
      break;
  }
}

executeBotCommands(command)
  }
);

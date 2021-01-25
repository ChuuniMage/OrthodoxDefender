import * as Discord from 'discord.js';
import { 
  getRoleByName, 
  updateUserRole, 
  memberHasAllRolesById,
  hasDefaultPFP,
  returnRoleIdNameArrayToPost,
} from './Utilities/roleUtils'
import { returnJoinDates, 
appendTxtFileIfPostTooBig,
postInWarned,
postInNamedChannel 
} from './Utilities/chanUtils'
import { isMemberVIP 
} from '../index'

export let postBoostInfoCommand = async (
  inputGuildObject:Discord.Guild, 
  inputMessage:Discord.Message) => {
  let boosterRole:Discord.Role = await getRoleByName(inputGuildObject, "Nitro Booster");
  let boosterRoleMembers = (await boosterRole).members;
  
  inputMessage.channel.send(
  `Server is currently at tier: ${inputGuildObject.premiumTier}
  Total number of Nitro Boosts: ${inputGuildObject.premiumSubscriptionCount}
  Total number of boosters: ${boosterRoleMembers.size}`
  );
}

export let joinCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message) =>
{
  await returnJoinDates(inputGuildObject,inputUserId).then(async (joinDateObject) => {
  inputMessage.channel.send(
    `${joinDateObject.memberName} joined:
   - Discord on ${joinDateObject.discordJoinDate}
   - ${inputGuildObject.name} on ${joinDateObject.serverJoinDate}`)}
   ).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let kickUserCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message, 
  inputReasonMessage?:string):Promise<void> => {

  await inputGuildObject.members.fetch(inputUserId).then(kickedUser => {
    if (isMemberVIP(kickedUser)) {
      return;
    }
    kickedUser.kick(inputReasonMessage)
    postInWarned(inputGuildObject, `<@!${kickedUser.id}> has been kicked! ${inputReasonMessage}`)
  }).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let banUserCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message, 
  inputReasonMessage?:string):Promise<void> => {
  await inputGuildObject.members.fetch(inputUserId).then(bannedUser => {
    if (isMemberVIP(bannedUser)) {
      return;
    }
    bannedUser.ban({ days: 0, reason: inputReasonMessage });
    postInWarned(inputGuildObject, `<@!${bannedUser.id}> has been banned! ${inputReasonMessage}`)
  }).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let quarantineCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message, 
  inputReasonMessage?:string) => {
  await inputGuildObject.members.fetch(inputUserId).then(()=>{

    updateUserRole.addRole.byName(inputGuildObject,inputUserId,"Quarantine");
    postInWarned(inputGuildObject, `<@!${inputUserId}> has been quarantined! ${inputReasonMessage}`)
  }).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let unQuarantineCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message, 
  inputReasonMessage?:string) => {
  await inputGuildObject.members.fetch(inputUserId).then(()=>{
    updateUserRole.removeRole.byName(inputGuildObject,inputUserId,"Quarantine");
    postInWarned(inputGuildObject, `<@!${inputUserId}> has been unquarantined! ${inputReasonMessage}`)
  }).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let whoIsCommand = async (
  inputGuildObject:Discord.Guild, 
  inputIDs:string[], 
  inputMessage:Discord.Message) => {
  let checkedMembers = await inputGuildObject.members.fetch();
  let usernameAndNicknameArray:string[] = []
  checkedMembers.forEach((member) => {
    if (memberHasAllRolesById(member, inputIDs)){
// Populates array with string entries of this format: "DiscordUser#1234 (Nickname)"
      let nickname = member.nickname ? member.nickname : member.user.username;
      usernameAndNicknameArray.push(`${member.user.username}#${member.user.discriminator} (${nickname})`)}
      })
        let postedUsers:string
        if (usernameAndNicknameArray[0] === undefined){
          postedUsers = 'No-one.';
        } else {
          postedUsers = usernameAndNicknameArray.join(", ")
        }
      let roleNameArray = returnRoleIdNameArrayToPost(inputIDs)
      let computedPost:string = `The users with the roles[${roleNameArray.join(", ")}] are: ${postedUsers}`
    appendTxtFileIfPostTooBig(computedPost,inputMessage, "WhoIsFile")
}

export let howManyAreCommand = async (
  inputGuildObject:Discord.Guild, 
  inputIDs:string[], 
  inputMessage:Discord.Message) => {

  let checkedMembers = await inputGuildObject.members.fetch();
  let usersWithRolesArray:string[] = []
  checkedMembers.forEach((member) => {
    if (memberHasAllRolesById(member, inputIDs)){
      usersWithRolesArray.push(member.user.username);
    }
  })
  let roleNameArray = returnRoleIdNameArrayToPost(inputIDs)
  
  inputMessage.channel.send(
    `Number of users with the following roles[${roleNameArray.join(", ")}] : ${usersWithRolesArray.length}`)
}

export let replaceAllRolesCommand = async (
  inputGuildObject:Discord.Guild,
  inputReplacedRoleId:string,
  inputNewRoleId:string) => {

  let checkedMembers = await inputGuildObject.members.fetch();
  checkedMembers.forEach((member)=> {
    if (memberHasAllRolesById(member,[inputReplacedRoleId])){
    updateUserRole.removeRole.byId(inputGuildObject,member.id,inputReplacedRoleId);
    updateUserRole.addRole.byId(inputGuildObject,member.id,inputNewRoleId)
      };
  })
}

export let checkPFPCommand = async (inputGuildObject:Discord.Guild) => {
  let checkedMembers = await inputGuildObject.members.fetch();
  checkedMembers.forEach((member) => {
  if (hasDefaultPFP(member)) {
    updateUserRole.addRole.byName(
    member.guild,
    member.id,
    "Change PFP")
  }
  })
}

export let warnCommand = async (
  inputGuildObject:Discord.Guild, 
  inputUserId:string, 
  inputMessage:Discord.Message,
  inputReasonMessage?:string) => {
  await inputGuildObject.members.fetch(inputUserId).then(warnedUser => {
// Three-stage warning system. 
// If no warned role, add "Warned" role. 
// If has "Warned", remove "Warned", add "Warned Twice". 
// If "Warned Twice", ban.
    if (isMemberVIP(warnedUser)) {
      return;
    }
    let rolesArray = warnedUser.roles.cache.array();

    for (let i = 0; i < rolesArray.length; i++) {
      let testedRoleName = warnedUser.roles.cache.array()[i].name;
      if (testedRoleName === "Warned Twice") {
        warnedUser.ban({ days: 0, reason: inputReasonMessage });
        postInWarned(inputGuildObject,
          `<@!${inputUserId}> has been banned for being warned three times! ${inputReasonMessage}`);
        return;
      }
      if (testedRoleName === "Warned") {
        updateUserRole.removeRole.byName(inputGuildObject,inputUserId,"Warned")
        updateUserRole.addRole.byName(inputGuildObject,inputUserId,"Warned Twice");
        updateUserRole.addRole.byName(inputGuildObject,inputUserId,"Quarantine")
        postInWarned(inputGuildObject,
          `<@!${inputUserId}> has been warned twice! ${inputReasonMessage}`);
        return;
      }
    }
    updateUserRole.addRole.byName(inputGuildObject,inputUserId,"Warned");
    updateUserRole.addRole.byName(inputGuildObject,inputUserId,"Quarantine")
    postInWarned(inputGuildObject,
      `<@!${inputUserId}> has been warned! ${inputReasonMessage}`);
  }).catch(() => {
    inputMessage.channel.send('No such user found.')
   }
  )
}

export let msgCommand = async (
  inputGuildObject:Discord.Guild,
  inputChannelId:string,
  inputMessage:Discord.Message,
  inputPost:string) => {

      const targetChannel = inputGuildObject.channels.cache.get(inputChannelId).name;
      postInNamedChannel(targetChannel)(inputGuildObject, inputPost).catch(
        () => inputMessage.channel.send('No channel found')
      )
}

export let dmsgCommand = async (
  inputGuildObject:Discord.Guild,
  inputUserId:string,
  inputMessage:Discord.Message,
  inputPost:string) => {

  await inputGuildObject.members.fetch(inputUserId).then((messagedUser) => {
    messagedUser.send(inputPost);
  }).catch(
    () => inputMessage.channel.send('No user found.')
  )
}
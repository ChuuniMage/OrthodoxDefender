import * as Discord from 'discord.js';
import { writeFileSync
} from "fs"

export const postInNamedChannel = 
(namedChannel:string) => 
async (inputGuildObject:Discord.Guild, inputPost:string) => {
  inputGuildObject.channels.cache.forEach(testedChannel => {
    if (testedChannel.name === namedChannel){
      // @ts-ignore
      return testedChannel.send(inputPost)
      }
  });
}

export let postInWarned = postInNamedChannel("🚨-warned-members")

type joinDateObjectType = {
  discordJoinDate:string,
  serverJoinDate:string
  memberName:string
}

export let returnJoinDates = async (inputGuildObject:Discord.Guild, inputUser:string):Promise<joinDateObjectType> => {
  let testedMember:Discord.GuildMember = await inputGuildObject.members.fetch(inputUser);
  let joinDateObject:joinDateObjectType = {
    discordJoinDate: testedMember.user.createdAt.toDateString(),
    serverJoinDate: testedMember.joinedAt.toDateString(),
    memberName: testedMember.displayName
  }
  return joinDateObject;
  }

export let appendTxtFileIfPostTooBig = (inputPost:string, inputMessage:Discord.Message,fileName:string) => {
    if (inputPost.length < 2000){
      inputMessage.channel.send(inputPost)
    } else {
      writeFileSync(`./${fileName}.txt`, inputPost);
      let fileToAttach = new Discord.MessageAttachment("./whoIsFile.txt");
      inputMessage.channel.send(
        `Error! The post is too big. Attacking text file with message contents.`,
        fileToAttach)
  }
}
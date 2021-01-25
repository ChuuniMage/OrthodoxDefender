import * as Discord from 'discord.js';

export const memberHasAllRolesById = (
  testedMember:Discord.GuildMember, 
  roleIdArray:string[]):boolean => {

  let matchGoal:number = roleIdArray.length;
  let runningCounter:number = 0;

  testedMember.roles.cache.forEach(memberRole => {
    roleIdArray.forEach(inputRoleTested => {
      if (memberRole.id === inputRoleTested){
        runningCounter++;
        }
    })
  });
      return runningCounter === matchGoal;
    }

export const memberHasAnyRoleByName = (
  testedMember:Discord.GuildMember, 
  roleNameArray:string[]):boolean => {

  let memberHasRoleBool:boolean = false;

  testedMember.roles.cache.forEach(memberRole => {
    roleNameArray.forEach(roleNameTested => {
      if (memberRole.name === roleNameTested){
          memberHasRoleBool = true;
          }
        })
      });
      return memberHasRoleBool;
    }
    
export const getRoleByName = async (guildObject:Discord.Guild, roleName: string, ):Promise<Discord.Role> => {

    let roleToBeReturned:Discord.Role = await guildObject.roles.fetch().then(roles => {
      return roles.cache.find((testedRole) => testedRole.name == roleName ) as Discord.Role;
    });
  
    if (roleToBeReturned === undefined) {
      console.log('Cannot get role!')
    } else {
      return roleToBeReturned;
      }
  }

let addRoleToUser = async (
    inputGuildObject:Discord.Guild, 
    inputUserId:string, 
    inputRoleId:string):Promise<void> => {

    let currentGuildMemberUser:Discord.GuildMember = await inputGuildObject.members.fetch(inputUserId)
    currentGuildMemberUser.roles.add(inputRoleId);

  }
  
let removeRoleFromUser =  async (
    inputGuildObject:Discord.Guild, 
    inputUserId:string, 
    inputRoleId:string):Promise<void> => {

    let currentGuildMemberUser:Discord.GuildMember = await inputGuildObject.members.fetch(inputUserId)
    currentGuildMemberUser.roles.remove(inputRoleId);

  }

let addRole = {
  byId: function(inputGuildObject:Discord.Guild, inputUserId:string, inputRoleId:string){
    addRoleToUser(inputGuildObject, inputUserId, inputRoleId);
  },
  byName: async function(inputGuildObject:Discord.Guild, inputUserId:string, inputRoleName:string){
    let inputRoleId = (await getRoleByName(inputGuildObject, inputRoleName)).id;
    addRoleToUser(inputGuildObject, inputUserId, inputRoleId);
  }
}

let removeRole = {
  byId: function(inputGuildObject:Discord.Guild, inputUserId:string, inputRoleId:string){
    removeRoleFromUser(inputGuildObject, inputUserId, inputRoleId);
  },
  byName: async function(inputGuildObject:Discord.Guild, inputUserId:string, inputRoleName:string){
    let inputRoleId = (await getRoleByName(inputGuildObject, inputRoleName)).id;
    removeRoleFromUser(inputGuildObject, inputUserId, inputRoleId);
  }
}

export const updateUserRole = {
  addRole,
  removeRole,
}

export const hasDefaultPFP = (inputMember:Discord.GuildMember) => {
  let defaultAvatar:string = inputMember.user.defaultAvatarURL;
  let displayAvatar:string = inputMember.user.displayAvatarURL();
  
  return defaultAvatar === displayAvatar
} 

export const returnRoleIdNameArrayToPost = (inputIDArray:string[]) => {
  return inputIDArray.map((roleId) => {return "<@&" + roleId + ">"})
}
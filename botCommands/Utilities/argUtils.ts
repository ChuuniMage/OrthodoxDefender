import {
  zeroArgCommandArray,
  oneArgCommandArray,
  twoArgCommandArray,
  arbitraryArgCommandArray
} from '../botCommands'

export const extractNumbersForId = (userInput:string|undefined):string|undefined => {
  if (userInput == undefined) {
    return undefined;
  }
    let regExForDigits = /\d+/g;
    let parsedInput = userInput.match(regExForDigits);
    if(parsedInput != null) {
    return parsedInput.join('');
  }
}

export const extractTokens = (userInput:string|undefined):string[]|undefined => {
  if (userInput == undefined) {
    return undefined;
  }
  let regExForSpace = /\s/g;
  let parsedInput = userInput.split(regExForSpace)
  if(parsedInput != null) {
  return parsedInput.filter(elem => elem !== '')
  }
}

export let returnIdArrayFromArgs = (inputArgs:string[]):string[] => {
  return inputArgs.map((inputArg) => extractNumbersForId(inputArg))
}

const isInputElementOfArray = <T>(inputArray:T[]) => (inputElement:T) => {
  return  inputArray.includes(inputElement) 
}

let isZeroArgCommand = isInputElementOfArray(zeroArgCommandArray)
let isOneArgCommand = isInputElementOfArray(oneArgCommandArray)
let isTwoArgCommand = isInputElementOfArray(twoArgCommandArray)
let isArbitraryArgCommand = isInputElementOfArray(arbitraryArgCommandArray)

export let returnCommandType = (inputCommand:string) => {
        if (isZeroArgCommand(inputCommand)){
          return "zero"
} else  if (isOneArgCommand(inputCommand)){
          return "one"
} else  if (isTwoArgCommand(inputCommand)){
          return "two"
} else  if (isArbitraryArgCommand(inputCommand)){
          return "arbitrary"
  }
  return "Invalid"
}
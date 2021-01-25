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

export let returnIdArrayFromArgs = (inputArgs:string[]):string[] => {
  return inputArgs.map((inputArg) => extractNumbersForId(inputArg))
}
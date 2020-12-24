// const parseStringToFloat = (text) => {
//     if(text.length === 0){
//         return text
//     }
//     lastChar = text.substr(text.length - 1)
//     lastChar = lastChar === ',' ? '.' : lastChar
//     if(lastChar != '.'){
//         if(!(/^-?[\d.]+(?:e-?\d+)?$/.test(lastChar))){
//             lastChar = ''
//         }
//     }
//     else{
//         if(text.length === 1){
//             lastChar = '0.'
//         }
//         if(text.substring(0, text.length - 1).includes('.')){
//             lastChar = ''
//         }
//     }
//     arr = text.split('.')
//     if(arr.length > 1){
//         if(arr[1].length > 1){
//             lastChar = ''
//         }
//     }
//     return text.substring(0, text.length - 1) + lastChar
// }

const parseStringToFloat = (text) => {
    if(!text){
        return '0.00'
    }
    textConverted = parseFloat(text) + ''
    arr = textConverted.split('.')
    if(arr.length === 1){
        return textConverted + '.00'
    }
    else{
        if(arr[1].length === 1){
            return textConverted + '0'
        }
    }
    return text
}

export default { parseStringToFloat }
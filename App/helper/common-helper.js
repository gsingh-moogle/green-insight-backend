exports.roundToDecimal =(number) => { 
    return parseFloat((Math.round(number * 100) / 100).toFixed(1));
}
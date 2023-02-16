exports.roundToDecimal =(number) => { 
    return parseFloat((Math.round(number * 10) / 10).toFixed(1));
}
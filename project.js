// 1. Deposit user money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user winnings
// 7. play again

const prompt = require("prompt-sync")();

const ROWS =  3; //Constant variables should be in CAPS
const COLS = 3;

const SYMBOLS_COUNT = { //creating an object that holds key and values
    A:2,
    B:4,
    C:6,
    D:8
}

const SYMBOL_VALUES = { //multiplier amount
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

//this is a function es6 style
const deposit = () =>{
    while (true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount); //is coverting the deposit amount string into a float 

        if(isNaN(numberDepositAmount) || numberDepositAmount<=0){
            console.log("Invalid deposit amount, try again.")
        }else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () =>{
    while (true){
        const lines = prompt("Enter the number of lines to bet on: ")
        const numberOfLines = parseInt(lines)

        if(isNaN(numberOfLines) || numberOfLines<=0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        }else{
            return numberOfLines;
        }
    }
}

const getBet= (balance, lines) =>{
    while (true){
        const bet = prompt("Enter the total bet pre line: ")
        const numberBet = parseFloat(bet)

        if(isNaN(numberBet) || numberBet<=0 || numberBet > balance / lines){
            console.log("Invalid bet, try again.");
        }else{
            return numberBet;
        }
    }
}

const spin = () =>{
    const symbols = []; //const because the type is not being changed but the elements within the array will be.
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){//this is looping through all the entries in SYMBOL_COUNT
        for(let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
        for (let i = 0; i<COLS; i++){ //Generating the elements in the reel
            reels.push([]) //creating a nested array to hold the symbols currently in the reel
            const reelSymbols = [...symbols]; //copying the symbols array
            for (let j = 0; j<ROWS; j++){
                const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                const selectedSymbol = reelSymbols[randomIndex];
                reels[i].push(selectedSymbol);
                reelSymbols.splice(randomIndex,1) //removing the symbol in reelSymbol array
            }
        }
        return reels;
}

//this is going to transpose the array from cols to rows. so we can check the winning lines
const transpose = (reels) =>{
    const rows = [];

    for(let i = 0; i<ROWS; i++){
        rows.push([])
        for(let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

const printRows = (rows)=>{
    for(const row of rows){ //iterating by item
        let rowString ="";
        for(const [i, symbol] of row.entries()){
            rowString+=symbol //adding the symbol to the string
            if(i!=row.length - 1){
                rowString +=" | "
            }
        }
        console.log(rowString)
    }
};

const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
}

const game = () =>{
    let balance = deposit(); //assigned as a let to change later

    while(true){
        console.log("Balance: $", balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin()
        const rows = transpose(reels);
        printRows(rows)
        console.log("Prev Balance: ", balance)
        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings;
        console.log("You won, $", winnings)

        if (balance <= 0){
            console.log("Insufficient Balance!");
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n)")
        if(playAgain != "y") break;
    }
}

game();



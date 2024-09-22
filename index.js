const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckbox = document.querySelectorAll("input[type = checkbox]");
const symbols = '~!@#$%^&*()_-/*-+,.<>/?:;"[{]}\|';

// initial/default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
//set color of strength grey
setIndicator("#ccc");
handleSlider();

//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

//set color of strength
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}  

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function shufflePassword(Array){
    //Fisher Yates Method   --> this method can be apply on an array to shuffle the given array
    for(let i = Array.length-1 ; i < 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str; 
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasUpper || hasLower) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        //method to copy content on clipboard      
        //this method returns promise
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    //to make copy vala span visible here we add active class
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange(){
    checkCount = 0;
    allcheckbox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',() =>{
    //none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //now start to find the new password

    //remove the old password
    password = "";

    //let's put the stuff mentioned by checkbox

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition in password
    for(let i = 0 ; i < funcArr.length ; i++){
        password += funcArr[i]();
    }

    //remaining part of password
    for(let i = 0 ; i < passwordLength - funcArr.length ; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //display password on UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
})
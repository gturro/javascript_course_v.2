const ATTACK = 10; //0
const STRONG_ATTACK = 14; //1
const MONSTER_ATTACK = 20;
const HEAL = 15;

const maxLifeInput = prompt("Choose yours maxlife and enemy's.","100");
const MODE_ATTACK = 0; //normal attack 0
const MODE_ATTACK_STRONG = 1; //strong attack 1
//log
const LOG_EV_PLAYER_ATTACK = "Player normal attack";
const LOG_EV_PLAYER_STRONG_ATTACK = "Player strong attack";
const LOG_EV_MONSTER_ATTACK = "Monster attack";
const LOG_EV_HEAL = "Player heal";

if (isNaN(maxLifeInput) || maxLifeInput <= 0){
  maxLife = 100;
}

let maxLife = parseInt(maxLifeInput);
let currentPlayerHealth = maxLife;
let currentMosnsterHealth = maxLife;
let hasBonusLife = true;
let battleLog = [];


//max life visual adjust 
adjustHealthBars(maxLife);

function reset(){
  currentPlayerHealth = maxLife;
  currentMosnsterHealth = maxLife;
  resetGame(maxLife); 
}

function writeToLog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (ev === LOG_EV_PLAYER_ATTACK){
    logEntry.target = "Monster";
  }else if (ev === LOG_EV_PLAYER_STRONG_ATTACK){
    logEntry.target = "Monster";
  }else if (ev === LOG_EV_MONSTER_ATTACK){
    logEntry.target = "Player";
  }else if (ev === LOG_EV_HEAL){
    logEntry.target = "Player";
  }
  battleLog.push(logEntry);
}

function endRound (){
  const initialPlayerLife = currentPlayerHealth;
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK);
  currentPlayerHealth -= monsterDamage;
  writeToLog(LOG_EV_MONSTER_ATTACK, monsterDamage, currentMosnsterHealth, currentPlayerHealth);

  if (currentMosnsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!")
    reset();
  }else if (currentPlayerHealth <= 0 && currentMosnsterHealth > 0){
    alert ("You lost!")
    reset();
  }else if (currentPlayerHealth <= 0 && currentMosnsterHealth <= 0){
    alert ("You have a draw");
    reset();
  }

  if (currentPlayerHealth <= 0 && hasBonusLife === true){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerLife
    alert("The bonus life saved you!");
    setPlayerHealth(initialPlayerLife);
  }
}

function attackMonster (mode){
  let maxDmg;
  if (mode === 0){
    maxDmg = ATTACK
  }else if (mode === 1){
    maxDmg = STRONG_ATTACK
  }
  const playerDamage = dealMonsterDamage(maxDmg);
  currentMosnsterHealth -= playerDamage;
  endRound();
}

function attackHandler(){ 
  attackMonster(MODE_ATTACK);
 }

function strongAttackHandler(){
  attackMonster(MODE_ATTACK_STRONG);
}

function healHandler(){
  let healValue;
  if (currentPlayerHealth >= maxLife - HEAL){
    alert("You can't heal more than your initial health.")
    healValue = maxLife - currentPlayerHealth;
  }else {
    healValue = HEAL
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  endRound();
}

function printLogHandler(){
  console.log(battleLog);
};

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogHandler);
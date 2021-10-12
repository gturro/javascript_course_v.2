const ATTACK_VALUE = 10; //0
const STRONG_ATTACK_VALUE = 14; //1
const MONSTER_ATTACK_VALUE = 20;
const HEAL_VALUE = 15;

const maxLifeInput = prompt("Choose yours maxlife and enemy's.","100");
const NORMAL_ATTACK = 0; //normal attack 0
const STRONG_ATTACK = 1; //strong attack 1
//log
const LOG_EV_PLAYER_ATTACK = "Player normal attack";
const LOG_EV_PLAYER_STRONG_ATTACK = "Player strong attack";
const LOG_EV_MONSTER_ATTACK = "Monster attack";
const LOG_EV_HEAL = "Player heal";
const LOG_EV_GAME_OVER = "Game Over";

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
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= monsterDamage;
  
  if (currentPlayerHealth <= 0 && hasBonusLife === true){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerLife
    alert("The bonus life saved you!");
    setPlayerHealth(initialPlayerLife);
  }

  writeToLog(
    LOG_EV_MONSTER_ATTACK,
    "Damage: " + monsterDamage.toFixed(2),
    currentMosnsterHealth,
    currentPlayerHealth
  );

  if (currentMosnsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!")
    writeToLog(
      LOG_EV_GAME_OVER,
      "Player won",
      currentMosnsterHealth,
      currentPlayerHealth
      );
    reset();
  }else if (currentPlayerHealth <= 0 && currentMosnsterHealth > 0){
    alert ("You lost!")
    writeToLog(
      LOG_EV_GAME_OVER,
      "Monster won",
      currentMosnsterHealth,
      currentPlayerHealth
      );
    reset();
  }else if (currentPlayerHealth <= 0 && currentMosnsterHealth <= 0){
    alert ("You have a draw");
    writeToLog(
      LOG_EV_GAME_OVER,
      "Draw",
      currentMosnsterHealth,
      currentPlayerHealth
      );
    reset();
  }
}

function attackMonster (mode){
  // const damage = mode === NORMAL_ATTACK ? ATTACK : STRONG_ATTACK;
  // const dmgMode = mode === NORMAL_ATTACK ? LOG_EV_PLAYER_ATTACK : LOG_EV_PLAYER_STRONG_ATTACK;
  if (mode === 0){
    damage = ATTACK_VALUE;
    dmgMode = LOG_EV_PLAYER_ATTACK;
  }else if (mode === 1){
    damage = STRONG_ATTACK_VALUE;
    dmgMode = LOG_EV_PLAYER_STRONG_ATTACK
  }
  const playerDamage = dealMonsterDamage(damage);
  currentMosnsterHealth -= playerDamage;
  writeToLog(dmgMode, "Damage: "+ damage.toFixed(2), currentMosnsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler(){ 
  attackMonster(NORMAL_ATTACK);
 }

function strongAttackHandler(){
  attackMonster(STRONG_ATTACK);
}

function healHandler(){
  let healValue;
  if (currentPlayerHealth >= maxLife - HEAL_VALUE){
    alert("You can't heal more than your initial health.")
    healValue = maxLife - currentPlayerHealth;
  }else {
    healValue = HEAL_VALUE
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EV_HEAL,
    healValue,
    currentMosnsterHealth,
    currentPlayerHealth
    );
  endRound();
}

function printLogHandler(){
  console.log(battleLog);
};

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogHandler);
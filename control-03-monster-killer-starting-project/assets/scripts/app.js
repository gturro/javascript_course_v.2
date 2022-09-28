let player = {
  ATTACK_VALUE : 10,
  STRONG_ATTACK_VALUE : 14,
  HEAL_VALUE : 15
};

let monster = {
  ATTACK_VALUE : 20
};

let maxLife;

//attack mode
const NORMAL_ATTACK = 0;
const STRONG_ATTACK = 1; 

//log
const logEvent = {
  PLAYER_ATTACK : "Player normal attack",
  PLAYER_STRONG_ATTACK : "Player strong attack",
  MONSTER_ATTACK : "Monster attack",
  HEAL : "Player heal",
  GAME_OVER : "Game Over"
};



let hasBonusLife = true;
let battleLog = [];



setMaxLife();
//max life visual adjust 
adjustHealthBars(maxLife);

function setMaxLife(){
  const maxLifeInput = prompt("Choose yours maxlife and enemy's.","100");
  maxLife = parseInt(maxLifeInput);
  if (isNaN(maxLifeInput) || maxLifeInput <= 0){
    maxLife = 100;
  }
  player.health = maxLife;
  monster.health = maxLife;
};

function reset(){
  player.health = maxLife;
  monster.health = maxLife;
  resetGameBars(maxLife); 
}

function writeToLog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (ev === logEvent.PLAYER_ATTACK || ev === logEvent.PLAYER_STRONG_ATTACK){
    logEntry.target = "Monster";
  }else if (ev === logEvent.MONSTER_ATTACK || ev === logEvent.HEAL){
    logEntry.target = "Player";
  }
  battleLog.push(logEntry);
}

function endRound (){
  const initialPlayerHealth = player.health;
  const monsterDamage = dealPlayerDamage(monster.ATTACK_VALUE);
  player.health -= monsterDamage;
  
  if (player.health <= 0 && hasBonusLife === true){
    hasBonusLife = false;
    removeBonusLife();
    player.health = initialPlayerHealth
    alert("The bonus life saved you!");
    setPlayerHealth(initialPlayerHealth);
  }

  writeToLog(
    logEvent.MONSTER_ATTACK,
    "Damage: " + monsterDamage.toFixed(2),
    monster.health,
    player.health
  );

  if (monster.health <= 0 && player.health > 0) {
    alert("You won!")
    writeToLog(
      logEvent.GAME_OVER,
      "Player won",
      monster.health,
      player.health
      );
    reset();
  }else if (player.health <= 0 && monster.health > 0){
    alert ("You lost!")
    writeToLog(
      logEvent.GAME_OVER,
      "Monster won",
      monster.health,
      player.health
      );
    reset();
  }else if (player.health <= 0 && monster.health <= 0){
    alert ("You have a draw");
    writeToLog(
      logEvent.GAME_OVER,
      "Draw",
      monster.health,
      player.health
      );
    reset();
  }
}

function attackMonster (mode){
  const damage = mode === NORMAL_ATTACK ? player.ATTACK_VALUE : player.STRONG_ATTACK_VALUE;
  const dmgMode = mode === NORMAL_ATTACK ? logEvent.PLAYER_ATTACK : logEvent.PLAYER_STRONG_ATTACK;
  const playerDamage = dealMonsterDamage(damage);
  
  monster.health -= playerDamage;
  writeToLog(dmgMode, "Damage: "+ damage.toFixed(2), monster.health, player.health);
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
  if (player.health >= maxLife - player.HEAL_VALUE){
    alert("You can't heal more than your initial health.")
    healValue = maxLife - player.health;
  }else {
    healValue = player.HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  player.health += healValue;
  writeToLog(
    logEvent.HEAL,
    healValue,
    monster.health,
    player.health
    );
  endRound();
};

function printLogHandler(){
  let i = 0;
  for (const logEntry of battleLog){
    console.log(`#${i}`);
    for (let key in logEntry){
      console.log(`${key} ==> ${logEntry[key]}`);
    }
  i++;
  };
};

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogHandler);
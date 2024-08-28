import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.maxhp = 100;
    this.power = 20;
  }

  attack() {
    // 플레이어의 공격
    return Math.floor((Math.random() * 5) + 1) + this.power; 
  }

  stats() {
    this.maxhp += 50;
    this.hp = Math.min(this.hp, this.maxhp);
    this.hp += Math.floor((Math.random() * 15) + 1) + 30;
    this.power += Math.floor(Math.random() * 10);
  }
}

class Monster {
  constructor(stage) {
    this.hp = 60 + stage * 7;
    this.maxhp = 60 + stage * 7;
    this.power = 5 + stage * 3;
  }

  attack() {
    // 몬스터의 공격
    return Math.floor((Math.random() * 5) +1) + this.power;
  }

  stats() {
    this.maxhp += 20;
    this.hp = this.maxhp;
    this.power += Math.floor(Math.random() * 6); 
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`) +
    chalk.blueBright(
      `\n| 플레이어 체력 : ${player.hp}, 플레이어 공격력 : ${player.power}, 플레이어 방어력 : ${player.defense} |`,
    ) +
    chalk.redBright(
      `\n| 몬스터 체력 : ${monster.hp}, 몬스터 공격력 : ${monster.power}, 몬스터 방어력 : ${monster.defense} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`)); // \n = 줄 나누기 위해 사용, ${} = 값을 넣기 위해 사용
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다. 2. 도망간다.`,
      ),
    );

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
     
    switch (choice) {
      case '1':
        const playerdamege = player.attack(monster);
        monster.hp -= playerdamege;
        logs.push(chalk.green(`플레이어가 몬스터에게 ${playerdamege}의 피해를 입혔습니다.`));

        if(monster.hp <= 0) {
          logs.push(chalk.redBright(`몬스터가 쓰러졌습니다.`));
          break;
        }

        const monsterdamege = monster.attack(player);
        player.hp -= monsterdamege;
        logs.push(chalk.redBright(`몬스터가 플레이어에게 ${monsterdamege}의 피해를 입혔습니다.`));
        
        if(player.hp <= 0) {
          logs.push(chalk.redBright(`플레이어가 쓰러졌습니다.`));
        }
        break;

      case '2':
        if(Math.random() < 0.7) {
          console.log(chalk.yellow(`\n플레이어가 도망에 성공했습니다.`));
          readlineSync.question('다음 스테이지로 넘어가려면 엔터키를 누르세요.')
          return true;
        
        } else {
          logs.push(chalk.redBright(`\n플레이어가 도망에 실패했습니다.`));
          const monsterdamege = monster.attack(player);
          player.hp -= monsterdamege;
          logs.push(chalk.redBright(`몬스터가 플레이어에게 ${monsterdamege}의 피해를 입혔습니다.`));
        }
        break;
        }

      }
    logs.push(chalk.green(`를 선택하셨습니다.`));
  }
  

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if(player.hp <= 0) {
      console.log(chalk.redBright(`플레이어가 사망했습니다.`));
      break;
    }
    
    if(monster.hp <= 0) {
      console.log(chalk.green(`스테이지 ${stage}클리어`));
      player.stats();
      monster.stats();
      readlineSync.question('다음 스테이지로 넘어가려면 엔터키를 누르세요.');
    }

    stage++;


    
    // 스테이지 클리어 및 게임 종료 조건
  }  

    if(player.hp > 0 && stage > 10) {
      console.log(chalk.green(`모든 스테이지를 클리어했습니다.)`));
    }
  
}

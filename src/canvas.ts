import { Promise } from 'es6-promise';

interface SnakeBody {
  x: number;
  y: number;
}

type Food = {
  [P in keyof SnakeBody]: SnakeBody[P]
};

type Direction = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';

let canvas = document.querySelector('canvas');
canvas.width = 608;
canvas.height = 600;

const c = canvas.getContext('2d');

const box = 32;

const drawPlayground = () => {
  c.fillStyle = '#006400';
  c.fillRect(0, 0, 19 * box, 2 * box);

  for (let x = 0; x <= 18; x++) {
    for (let y = 2; y <= 18; y++) {
      if (x === 0 || y === 2 || x === 18 || y === 18) {
        c.fillStyle = '#228B22';
      } else {
        if ((x % 2 === 0 && y % 2 !== 0) || (x % 2 !== 0 && y % 2 === 0)) {
          c.fillStyle = '#F5DEB3';
        } else {
          c.fillStyle = '#FFEFD5';
        }
      }
      c.fillRect(x * box, y * box, box, box);
    }
  }
};

const drawFood = (x: Food['x'], y: Food['y']) => {
  const food = new Image();
  food.src = './food.png';
  c.drawImage(food, x * box, y * box, box, box);
};

const drawScore = () => {
  c.fillStyle = 'white'; 
  c.font = '45px Changa One';
  c.fillText(String(score), 80, 55);
};

const drawGameInfo = score => {
  c.fillStyle = '#FF4500'; 
  c.font = '45px Changa One';
  c.fillText(`Your score is ${score}...`, 120, 300);
};

const draw = (snake: Snake) => {
  drawPlayground();
  drawFood(1, 0.625);
  drawScore();

  drawFood(food.x, food.y);
  
  snake.gaming()
    .then(() => {
      snake.move();
      food = snake.growUp(food);
    })
    .catch(() => {
      snake.drawSnake();
      drawGameInfo(score);
    });
};

class Snake {
  direction: Direction = 'RIGHT';
  snake: Array<SnakeBody>;

  constructor(snake: Array<SnakeBody>) {
    this.snake = snake;
  }

  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      c.fillStyle = i === 0 ? '#00CED1' : '#F0FFFF';
      c.fillRect(this.snake[i].x * box, this.snake[i].y * box, box, box);
  
      c.strokeStyle = 'red';
      c.strokeRect(this.snake[i].x * box, this.snake[i].y * box, box, box);
    }
  }

  getX(index: number) {
    return this.snake[index].x;
  }

  getY(index: number) {
    return this.snake[index].y;
  }

  setDirection(d: Direction) {
    this.direction = d;
  }

  setNextSnake(): SnakeBody {
    let nextSnake: SnakeBody = null;

    if (this.direction === 'RIGHT') {
      nextSnake = {
        x: this.snake[0].x + 1,
        y: this.snake[0].y
      };
    } 
    if (this.direction === 'LEFT')  {
      nextSnake = {
        x: this.snake[0].x - 1,
        y: this.snake[0].y
      }
    }
    if (this.direction === 'TOP')  {
      nextSnake = {
        x: this.snake[0].x,
        y: this.snake[0].y - 1
      }
    }
    if (this.direction === 'BOTTOM') {
      nextSnake = {
        x: this.snake[0].x,
        y: this.snake[0].y + 1
      }
    }

    return nextSnake;
  }

  move() {
    this.snake.pop();
    this.snake.unshift(this.setNextSnake());
    this.drawSnake();
  }

  growUp(food: Food): Food {
    const lastSnake = this.snake[this.snake.length - 1];
    let newSnake: SnakeBody = null;
    let newFood: Food = food;

    if (this.snake[0].x === food.x && this.snake[0].y === food.y) {
      score++;

      newFood = {
        x: Math.floor(Math.random() * 17 + 1),
        y : Math.floor(Math.random() * 15 + 3),
      };
      
      if (this.direction === 'RIGHT') {
        newSnake = {
          x: lastSnake.x + 1,
          y: lastSnake.y
        }
      }

      if (this.direction === 'LEFT') {
        newSnake = {
          x: lastSnake.x - 1,
          y: lastSnake.y
        }
      }

      if (this.direction === 'TOP') {
        newSnake = {
          x: lastSnake.x,
          y: lastSnake.y + 1
        }
      }

      if (this.direction === 'BOTTOM') {
        newSnake = {
          x: lastSnake.x,
          y: lastSnake.y - 1
        }
      }

      this.snake.push(newSnake);
    }

    return newFood;
  }

  gaming() {
    let head = this.snake[0];
    
    return new Promise((resolve, reject) => {
      // 到达边界
      if (head.x === 0 || head.x === 18 || head.y === 2 || head.y === 18) {
        reject();
        return;
      }

      // 咬到自己
      for (let i = 1; i < this.snake.length; i++) {
        if ((head.x === this.snake[i].x && head.y === this.snake[i].y) && this.snake.length > 3) {
          reject();
          return;
        }
      }

      resolve();
    })
  }
};

const keyboardControl = e => {
  if (e.keyCode === 39 && snake.direction !== 'LEFT') {
    snake.setDirection('RIGHT');
  } 
  if (e.keyCode === 37 && snake.direction !== 'RIGHT') {
    snake.setDirection('LEFT');
  } 
  if (e.keyCode === 38 && snake.direction !== 'BOTTOM') {
    snake.setDirection('TOP');
  }
  if (e.keyCode === 40 && snake.direction !== 'TOP')  {
    snake.setDirection('BOTTOM');
  }
};


let initSnake: Array<SnakeBody> = [
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

let food: Food = {
  x: Math.floor(Math.random() * 17 + 1),
  y : Math.floor(Math.random() * 15 + 3)
};

let score = 0;

const snake: Snake = new Snake(initSnake);

document.addEventListener('keydown', keyboardControl);

// 设置动画帧率
let FPS = 10;
const fpsInterval = 1000 / FPS;
let last = new Date().getTime();

const animate = () => {
  requestAnimationFrame(animate);

  let now = new Date().getTime();
  let elapsed = now - last;

  // 当刷新的时间间隔大于 fpsInterval 则绘制动画
  if (elapsed > fpsInterval) {
    last = now - (elapsed % fpsInterval);

    c.clearRect(0, 0, innerWidth, innerHeight);
    draw(snake);
  }
}

animate();

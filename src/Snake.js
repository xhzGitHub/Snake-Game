import { Promise } from 'es6-promise';

export class Snake {
  constructor(snake) {
    this.snake = snake;
    this.direction = 'RIGHT';
  }

  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      c.fillStyle = i === 0 ? '#00CED1' : '#F0FFFF';
      c.fillRect(this.snake[i].x * box, this.snake[i].y * box, box, box);
  
      c.strokeStyle = 'red';
      c.strokeRect(this.snake[i].x * box, this.snake[i].y * box, box, box);
    }
  }

  getX() {
    return this.snake.x;
  }

  getY() {
    return this.snake.y;
  }

  setDirection(d) {
    this.direction = d;
  }

  setNextSnake() {
    let nextSnake = {};

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

  growUp(food) {
    const lastSnake = this.snake[this.snake.length - 1];
    let newSnake = {};
    let newFood = food;

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
}
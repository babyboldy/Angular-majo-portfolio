import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnakeGameService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private GRID = 20;
  private W = 0;
  private H = 0;

  private snake: {x: number, y: number}[] = [];
  private dir = {x: 1, y: 0};
  private nextDir = {x: 1, y: 0};
  private food = {x: 0, y: 0};
  private score = 0;
  private bestScore = 0;
  private running = false;
  private paused = false;
  private gameLoop: any;

  constructor() {}

  initGame(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.W = canvas.width / this.GRID;
    this.H = canvas.height / this.GRID;
    this.loadBestScore();
    this.drawInitialCanvas();
  }

  startGame(): void {
    this.snake = [{x: 10, y: 9}, {x: 9, y: 9}, {x: 8, y: 9}];
    this.dir = {x: 1, y: 0};
    this.nextDir = {x: 1, y: 0};
    this.score = 0;
    this.spawnFood();
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.running = true;
    this.paused = false;
    this.gameLoop = setInterval(() => this.tick(), 180);
  }

  toggleGame(): void {
    if (!this.running) {
      this.startGame();
      return;
    }
    this.paused = !this.paused;
    if (this.paused) {
      clearInterval(this.gameLoop);
    } else {
      this.gameLoop = setInterval(() => this.tick(), 180);
    }
  }

  changeDirection(dx: number, dy: number): void {
    if (dx !== 0 && this.dir.x !== 0) return;
    if (dy !== 0 && this.dir.y !== 0) return;
    this.nextDir = {x: dx, y: dy};
  }

  private tick(): void {
    this.dir = this.nextDir;
    const head = {x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y};

    if (head.x < 0 || head.x >= this.W || head.y < 0 || head.y >= this.H ||
        this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.saveBestScore();
      }
      this.spawnFood();
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  private spawnFood(): void {
    let pos: {x: number; y: number};
    do {
      pos = {x: Math.floor(Math.random() * this.W), y: Math.floor(Math.random() * this.H)};
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  }

  private draw(): void {
    const colors = this.getColors();
    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // grid
    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 0.5;
    for (let x = 0; x < this.W; x++) {
      for (let y = 0; y < this.H; y++) {
        this.ctx.strokeRect(x * this.GRID, y * this.GRID, this.GRID, this.GRID);
      }
    }

    // food
    this.ctx.fillStyle = colors.food;
    this.ctx.shadowColor = colors.food;
    this.ctx.shadowBlur = 8;
    this.ctx.beginPath();
    this.ctx.arc(this.food.x * this.GRID + this.GRID/2, this.food.y * this.GRID + this.GRID/2, this.GRID/2 - 2, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // snake
    this.snake.forEach((s, i) => {
      this.ctx.fillStyle = i === 0 ? colors.snakeHead : colors.snake;
      this.ctx.shadowColor = colors.snake;
      this.ctx.shadowBlur = i === 0 ? 8 : 0;
      const r = i === 0 ? 6 : 4;
      this.roundRect(s.x * this.GRID + 1, s.y * this.GRID + 1, this.GRID - 2, this.GRID - 2, r);
      this.ctx.shadowBlur = 0;
    });
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private gameOver(): void {
    clearInterval(this.gameLoop);
    this.running = false;
    this.drawGameOver();
  }

  private drawGameOver(): void {
    this.draw();
    const colors = this.getColors();
    this.ctx.fillStyle = 'rgba(15,23,42,0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#F1F5F9';
    this.ctx.font = 'bold 22px JetBrains Mono';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2 - 20);
    this.ctx.font = '14px JetBrains Mono';
    this.ctx.fillStyle = '#22C55E';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 10);
    this.ctx.fillStyle = '#94A3B8';
    this.ctx.fillText('Press Start to play again', this.canvas.width/2, this.canvas.height/2 + 38);
  }

  private drawInitialCanvas(): void {
    const colors = this.getColors();
    this.ctx.fillStyle = colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#64748B';
    this.ctx.font = '14px JetBrains Mono';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Press Start to play 🎮', this.canvas.width/2, this.canvas.height/2);
  }

  private getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      bg: isDark ? '#0F172A' : '#F8FAFC',
      grid: isDark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.06)',
      snake: '#FB923C',
      snakeHead: '#FDBA74',
      food: '#22C55E',
      text: isDark ? '#F1F5F9' : '#0F172A',
    };
  }

  private loadBestScore(): void {
    const saved = localStorage.getItem('snakeBestScore');
    this.bestScore = saved ? parseInt(saved, 10) : 0;
  }

  private saveBestScore(): void {
    localStorage.setItem('snakeBestScore', this.bestScore.toString());
  }

  getScore(): number {
    return this.score;
  }

  getBestScore(): number {
    return this.bestScore;
  }

  isRunning(): boolean {
    return this.running;
  }

  isPaused(): boolean {
    return this.paused;
  }
}

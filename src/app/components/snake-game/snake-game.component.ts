import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { SnakeGameService } from '../../services/snake-game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent implements OnInit, AfterViewInit {
  score = 0;
  bestScore = 0;
  isRunning = false;
  isPaused = false;

  constructor(private snakeGameService: SnakeGameService) {}

  ngOnInit(): void {
    this.updateScores();
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('snakeCanvas') as HTMLCanvasElement;
    if (canvas) {
      this.snakeGameService.initGame(canvas);
    }
    setInterval(() => this.updateScores(), 150);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    switch(event.key) {
      case 'ArrowUp':
      case 'w':
        event.preventDefault();
        this.snakeGameService.changeDirection(0, -1);
        break;
      case 'ArrowDown':
      case 's':
        event.preventDefault();
        this.snakeGameService.changeDirection(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
        event.preventDefault();
        this.snakeGameService.changeDirection(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
        event.preventDefault();
        this.snakeGameService.changeDirection(1, 0);
        break;
    }
  }

  changeDir(dx: number, dy: number): void {
    this.snakeGameService.changeDirection(dx, dy);
  }

  startGame(): void {
    this.snakeGameService.startGame();
    this.updateScores();
  }

  toggleGame(): void {
    this.snakeGameService.toggleGame();
    this.updateScores();
  }

  private updateScores(): void {
    this.score = this.snakeGameService.getScore();
    this.bestScore = this.snakeGameService.getBestScore();
    this.isRunning = this.snakeGameService.isRunning();
    this.isPaused = this.snakeGameService.isPaused();
  }
}

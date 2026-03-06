import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true);
  public isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    this.setTheme(isDark);
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.setTheme(newTheme);
  }

  private setTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  getCurrentTheme(): boolean {
    return this.isDarkTheme.value;
  }
}

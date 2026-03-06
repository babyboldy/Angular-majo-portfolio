import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioApiService, Utilisateur } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, AfterViewInit {
  fullName = 'Majo in Tech';
  currentText = '';
  currentIndex = 0;
  showCodeCard = true; // always show card
  utilisateur: Utilisateur | null = null;
  cvDownloadUrl: string | null = null;

  constructor(private api: PortfolioApiService) {}

  ngOnInit(): void {
    // always show code card; screen-size check removed
    this.api.getUtilisateurs().subscribe((users) => {
      const u = users[0];
      if (u) {
        this.utilisateur = u;
        this.fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || this.fullName;
        if (u.url_telechargement_cv) {
          this.cvDownloadUrl = u.url_telechargement_cv;
        } else if (u.id) {
          this.cvDownloadUrl = this.api.getCvDownloadUrl(u.id);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.startTypingAnimation();
  }

  // screen size logic removed; card is permanently visible

  private startTypingAnimation(): void {
    const textLength = 14; // "Majo in Tech" with space
    const duration = 5000; // 5 seconds in milliseconds
    const delayPerChar = duration / textLength;

    const typeChar = () => {
      if (this.currentIndex <= textLength) {
        this.currentText = this.fullName.slice(0, this.currentIndex);
        this.currentIndex++;
        setTimeout(typeChar, delayPerChar);
      }
    };
    typeChar();
  }

  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  downloadCV(): void {
    if (this.cvDownloadUrl) {
      window.open(this.cvDownloadUrl, '_blank');
      return;
    }
    this.showToast('📄 Aucun CV disponible pour le moment.');
  }

  private showToast(message: string): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3500);
  }
}

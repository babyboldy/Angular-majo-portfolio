import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioApiService, Utilisateur, Competence } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  skills: string[] = [
    'Angular', 'TypeScript', 'Flutter', 'Django', 'Python',
    'React', 'Node.js', 'Firebase', 'PostgreSQL', 'Git',
    'REST API', 'UI/UX'
  ];
  utilisateur: Utilisateur | null = null;
  cvDownloadUrl: string | null = null;

  constructor(private api: PortfolioApiService) {}

  ngOnInit(): void {
    this.api.getUtilisateurs().subscribe((users) => {
      const u = users[0];
      if (u) {
        this.utilisateur = u;
        if (u.url_telechargement_cv) {
          this.cvDownloadUrl = u.url_telechargement_cv;
        } else if (u.id) {
          this.cvDownloadUrl = this.api.getCvDownloadUrl(u.id);
        }
      }
    });
    this.api.getCompetences().subscribe((list) => {
      if (list.length) {
        this.skills = list.map((c: Competence) => c.nom);
      }
    });
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

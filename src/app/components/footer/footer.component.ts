import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioApiService, ReseauSocial } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  brandName = 'Majo in Tech';
  socialLinks: { href: string; icon: string; title: string }[] = [
    { href: 'https://github.com/babyboldy', icon: 'fab fa-github', title: 'GitHub' },
    { href: 'https://www.linkedin.com/in/marie-joseph-emmanuelle--kossonou/', icon: 'fab fa-linkedin', title: 'LinkedIn' },
    { href: 'https://www.instagram.com/_babyyboldy?igsh=YW01ZmV1NnRvbHBm&utm_source=qr', icon: 'fab fa-instagram', title: 'Instagram' },
    { href: 'mailto:majokossonou@gmail.com', icon: 'fas fa-envelope', title: 'Email' }
  ];

  constructor(private api: PortfolioApiService) {}

  ngOnInit(): void {
    this.api.getUtilisateurs().subscribe((users) => {
      const u = users[0];
      if (u) {
        this.brandName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || this.brandName;
      }
    });
    this.api.getReseauxSociaux().subscribe((list) => {
      if (list.length) {
        this.socialLinks = list.map((r: ReseauSocial) => ({
          href: r.lien,
          icon: this.iconForPlateforme(r.nom_plateforme),
          title: r.nom_plateforme
        }));
      }
    });
  }

  private iconForPlateforme(nom: string): string {
    const n = (nom || '').toUpperCase();
    if (n.includes('GITHUB')) return 'fab fa-github';
    if (n.includes('LINKEDIN')) return 'fab fa-linkedin';
    if (n.includes('TWITTER')) return 'fab fa-twitter';
    if (n.includes('FACEBOOK')) return 'fab fa-facebook';
    if (n.includes('INSTAGRAM')) return 'fab fa-instagram';
    return 'fas fa-link';
  }
}

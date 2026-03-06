import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioApiService } from '../../services/portfolio-api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm = {
    name: '',
    email: '',
    message: ''
  };
  sending = false;
  contactEmail = 'majokossonou@gmail.com';
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
      if (u?.email) this.contactEmail = u.email;
    });
    this.api.getReseauxSociaux().subscribe((list) => {
      this.socialLinks = list.map((r) => ({
        href: r.lien,
        icon: this.iconForPlateforme(r.nom_plateforme),
        title: r.nom_plateforme
      }));
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

  sendMessage(): void {
    const { name, email, message } = this.contactForm;

    if (!name.trim() || !email.trim() || !message.trim()) {
      this.showToast('⚠️ Veuillez remplir tous les champs');
      return;
    }

    this.sending = true;
    this.api.envoyerContact({
      nom_complet: name.trim(),
      email: email.trim(),
      objet: 'Contact portfolio',
      message: message.trim()
    }).subscribe({
      next: () => {
        this.showToast('✅ Message envoyé ! Je vous recontacterai bientôt.');
        this.contactForm = { name: '', email: '', message: '' };
      },
      error: () => {
        this.showToast('❌ Erreur d\'envoi. Réessayez ou contactez-moi par email.');
      },
      complete: () => {
        this.sending = false;
      }
    });
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

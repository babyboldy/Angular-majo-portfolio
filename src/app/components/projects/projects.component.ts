import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioApiService, Projet } from '../../services/portfolio-api.service';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  icon: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    title: "N'SAPKA",
    description: 'Mobile-first marketplace for Ivorian artisans.',
    technologies: ['Flutter', 'Django', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    icon: '✍️',
    githubUrl: 'https://github.com/babyboldy/ArtisanAfrica'
  },
  {
    title: 'Custom Admin Django Package',
    description: 'An open-source Django package that extends the admin interface with modern UI components, advanced filters, and bulk actions.',
    technologies: ['Python', 'Django', 'PyPI'],
    gradient: 'linear-gradient(135deg,#0EA5E9,#22C55E)',
    icon: '📦',
    githubUrl: 'https://github.com/babyboldy/Admin-Integral'
  },

  {
    title: 'GRIOT',
    description: 'Ivorian cultural and tourism application.',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    gradient: 'linear-gradient(135deg,#EC4899,#6366F1)',
    icon: '📱',
    githubUrl: 'https://github.com/babyboldy'
  },
  {
    title: 'BABILOC',
    description: 'A full-featured platform for renting cars and apartments, with advanced search, booking management, and real-time availability.',
    technologies: ['Django', 'Angular', 'PostgreSQL', 'REST API'],
    gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
    icon: '🏠',
    githubUrl: 'https://github.com/babyboldy'
  }


];

const GRADIENTS = [
  'linear-gradient(135deg,#6366F1,#8B5CF6)',
  'linear-gradient(135deg,#0EA5E9,#22C55E)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#EC4899,#6366F1)',
];

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [...FALLBACK_PROJECTS];

  constructor(private api: PortfolioApiService) {}

  ngOnInit(): void {
    this.api.getProjets().subscribe((list) => {
      if (list.length) {
        const origin = this.api.backendOrigin;
        this.projects = list.map((p: Projet, i: number) => ({
          title: p.titre,
          description: p.resume,
          technologies: [
            ...(p.languages?.map((l) => l.nom) ?? []),
            ...(p.competences?.map((c) => c.nom) ?? [])
          ].filter(Boolean),
          gradient: GRADIENTS[i % GRADIENTS.length],
          icon: p.type_de_projet === 'Mobile' ? '📱' : '🌐',
          imageUrl: p.image ? (p.image.startsWith('http') ? p.image : `${origin}${p.image}`) : undefined,
          liveUrl: p.lien || undefined
        }));
      }
    });
  }

  openLink(url: string): void {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioApiService, Experience } from '../../services/portfolio-api.service';

interface TimelineItem {
  date: string;
  role: string;
  company?: string;
  description: string;
  icon: string;
}

const FALLBACK_TIMELINE: TimelineItem[] = [
    {
    date: '2024 – Present',
    role: 'Human Resources Director (BABILOC)',
    description: 'Project management in an Ivorian startup.',
    icon: '💼'
  },
  {
    date: 'November 2025 – February 2026',
    role: 'Project manager (FX LABS)',
    description: 'Project management in an Ivorian startup.',
    icon: '💼'
  },

  {
    date: '2023 - Present',
    role: 'Freelance Web Developer',
    description: 'Built and delivered multiple client projects including business websites, e-commerce solutions, and custom admin dashboards using Django, Angular, and REST APIs.',
    icon: '📱'
  },
  {
    date: '2023 – Present',
    role: 'Software Engineering Student (Ivorian Institut of Technology)',
    description: 'Pursuing a degree in software engineering, deepening expertise in algorithms, system design, web architectures, and mobile development. Active contributor to open-source projects.',
    icon: '🎓'
  },
  {
    date: '2021',
    role: 'Baccalaureate (LA FARANDOLE INTERNATIONALE)',
    description: 'General Baccalaureate with a scientific option: Mathematics, Physics, Life and Earth Sciences.',
    icon: '🎓'
  }
];

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {
  timeline: TimelineItem[] = [...FALLBACK_TIMELINE];

  constructor(private api: PortfolioApiService) {}

  ngOnInit(): void {
    this.api.getExperiences().subscribe((list: Experience[]) => {
      if (list.length) {
        // convert backend structure to our display model
        this.timeline = list.map((exp: Experience) => ({
          date: exp.date_fin ? `${exp.date_debut} – ${exp.date_fin}` : exp.date_debut,
          role: exp.role,
          company: exp.nom_entreprise,
          description: exp.description,
          icon: exp.type_de_contrat === 'education' ? '🎓' : '💼' // simplistic
        }));
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {
  services: Service[] = [
    {
      icon: '🌐',
      title: 'Web Development',
      description: 'Building modern, responsive, and performant websites using Angular, React, and cutting-edge web technologies.'
    },
    {
      icon: '📱',
      title: 'Mobile Development',
      description: 'Developing intuitive and performant cross-platform mobile applications with Flutter and React Native.'
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Designing clean, accessible, and user-friendly interfaces that delight users and drive engagement.'
    },
    {
      icon: '⚙️',
      title: 'Digital Solutions',
      description: 'Creating custom tools, APIs, and platforms that solve real-world problems with robust backend architecture.'
    }
  ];
}

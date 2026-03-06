import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Utilisateur {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  photo_profil?: string;
  description?: string;
  age?: string;
  lien_cv?: string;
  telephone?: string;
  url_telechargement_cv?: string;
}

export interface Competence {
  id: number;
  nom: string;
  description?: string;
  categorie: string;
  niveau: string;
  icone_url?: string;
}

export interface Language {
  id: number;
  nom: string;
}

export interface Projet {
  id: number;
  titre: string;
  resume: string;
  image?: string;
  lien: string;
  type_de_projet: string;
  languages: Language[];
  competences: Competence[];
  utilisateur?: number;
}

export interface Experience {
  id: number;
  date_debut: string;
  date_fin?: string;
  role: string;
  nom_entreprise: string;
  description: string;
  type_de_contrat: string;
}

export interface ReseauSocial {
  id: number;
  nom_plateforme: string;
  lien: string;
  utilisateur: number;
}

export interface PriseDeContactPayload {
  nom_complet: string;
  email: string;
  objet: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private baseUrl = environment.apiUrl;

  /** Origine du backend (sans /api/v1) pour les URLs media (images, etc.) */
  get backendOrigin(): string {
    return this.baseUrl.replace(/\/api\/v1\/?$/, '');
  }

  constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/utilisateurs/`).pipe(
      catchError(() => of([]))
    );
  }

  getUtilisateur(id: number): Observable<Utilisateur | null> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/utilisateurs/${id}/`).pipe(
      catchError(() => of(null))
    );
  }

  /** URL pour télécharger le CV (fichier PDF) d'un utilisateur */
  getCvDownloadUrl(utilisateurId: number): string {
    return `${this.baseUrl}/utilisateurs/${utilisateurId}/telecharger-cv/`;
  }

  getProjets(type?: string): Observable<Projet[]> {
    // build HttpParams to satisfy typing and avoid undefined properties
    let params = new HttpParams();
    if (type) {
      params = params.set('type_de_projet', type);
    }

    return this.http.get<Projet[]>(`${this.baseUrl}/projets/`, { params }).pipe(
      // explicitly annotate the fallback observable so it stays Projet[]
      catchError(() => of<Projet[]>([]))
    );
  }

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.baseUrl}/experiences/`).pipe(
      catchError(() => of([]))
    );
  }

  getCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.baseUrl}/competences/`).pipe(
      catchError(() => of([]))
    );
  }

  getReseauxSociaux(): Observable<ReseauSocial[]> {
    return this.http.get<ReseauSocial[]>(`${this.baseUrl}/reseaux/`).pipe(
      catchError(() => of([]))
    );
  }

  envoyerContact(payload: PriseDeContactPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/contacts/`, payload);
  }
}

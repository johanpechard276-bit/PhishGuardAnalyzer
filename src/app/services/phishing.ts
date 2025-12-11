// src/app/services/phishing/phishing.service.ts

import { Injectable } from '@angular/core';

// Interfaces
export interface AnalysisResult {
  score: number;
  level: 'safe' | 'suspicious' | 'danger';
  details: { rule: string, points: number }[];
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  isPhishing: boolean;
  explanation: string;
}

// Données du Quiz
const PHISHING_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    scenario: "Objet: Alerte de Sécurité Immédiate - Votre compte a été suspendu.\nCher client, veuillez cliquer sur ce lien [http://secure-login-votre-banque.com] dans les 12 heures pour le vérifier, sinon il sera fermé définitivement.",
    isPhishing: true,
    explanation: "C'est probablement du phishing : l'urgence, la menace de suspension et la demande de cliquer sur un lien pour 'vérifier' sont des tactiques classiques.",
  },
  {
    id: 2,
    scenario: "Objet: Mise à jour de la politique de confidentialité 2024.\nBonjour, suite aux nouvelles réglementations, vous trouverez tous les détails sur notre site officiel. Aucune action n'est requise de votre part. Cordialement, [Nom de l'entreprise].",
    isPhishing: false,
    explanation: "C'est probablement un e-mail légitime : il n'y a pas d'urgence ni de demande d'action immédiate.",
  },
];


@Injectable({
  providedIn: 'root'
})
export class PhishingService {

  constructor() { }

  // 1. Point d'entrée principal pour l'analyse URL/Texte
  public analyzeInput(input: string): AnalysisResult {
    const text = input.trim().toLowerCase();
    let score = 0;
    const details: { rule: string, points: number }[] = [];

    // --- RÈGLES HEURISTIQUES SIMPLES ---
    const urgentKeywords = ['urgent', 'immédiat', 'vérification', 'suspendu', 'facture', 'paiement', 'compromis', 'cliquez ici'];
    for (const keyword of urgentKeywords) {
      if (text.includes(keyword)) {
        score += 15;
        details.push({ rule: `Mot-clé d'urgence ou financier détecté : "${keyword}"`, points: 15 });
      }
    }

    // Analyse des URLs suspectes
    if (text.startsWith('http')) {
      if (text.length > 80) {
        score += 10;
        details.push({ rule: "URL très longue (longueur > 80 caractères)", points: 10 });
      }
      if (text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          score += 30;
          details.push({ rule: "L'URL utilise une adresse IP brute au lieu d'un nom de domaine", points: 30 });
      }
    }
    
    // --- Détermination du Niveau de Risque ---
    let level: 'safe' | 'suspicious' | 'danger';
    if (score < 20) { level = 'safe'; }
    else if (score < 50) { level = 'suspicious'; }
    else { level = 'danger'; }
    
    if (details.length === 0) {
        details.push({ rule: "Aucun indicateur de phishing simple détecté.", points: 0 });
    }

    return { score, level, details }; // <-- Retourne la valeur requise
  }
  
  // 2. Point d'entrée pour l'analyse de l'expéditeur (Nouveau Code)
  public analyzeSender(senderEmail: string): AnalysisResult {
      let score = 0;
      const details: { rule: string, points: number }[] = [];
      const lowerEmail = senderEmail.trim().toLowerCase();

      const typoDomains = ['g00gle.com', 'app1e.com', 'micr0soft.com', 'amaz0n.com', 'securyte-apple.com'];
      for (const domain of typoDomains) {
          if (lowerEmail.includes(domain)) {
              score += 50;
              details.push({ rule: `Domaine d'expéditeur suspect (Typosquatting : ${domain})`, points: 50 });
          }
      }
      
      if (lowerEmail.match(/bank\d/i) || lowerEmail.includes('-security')) {
          score += 25;
          details.push({ rule: "Nom d'expéditeur contenant des chiffres ou tirets inhabituels.", points: 25 });
      }
      
      let level: 'safe' | 'suspicious' | 'danger';
      if (score < 20) { level = 'safe'; }
      else if (score < 50) { level = 'suspicious'; }
      else { level = 'danger'; }

      if (details.length === 0) {
          details.push({ rule: "Aucun indicateur d'expéditeur suspect détecté.", points: 0 });
      }

      return { score, level, details };
  }

  // 3. Méthode pour récupérer les questions du quiz
  public getQuizQuestions(): QuizQuestion[] { // <--- Ajout de 'public' ici et suppression du point de conflit
    return PHISHING_QUIZ;
  }
}
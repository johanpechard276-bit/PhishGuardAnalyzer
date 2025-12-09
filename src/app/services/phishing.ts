// Nouveau contenu COMPLET à copier-coller dans src/app/services/phishing/phishing.service.ts

import { Injectable } from '@angular/core';

// Interface pour le résultat de l'analyse
export interface AnalysisResult {
  score: number; // Score de risque (plus il est élevé, plus le risque est grand)
  level: 'safe' | 'suspicious' | 'danger';
  details: { rule: string, points: number }[];
}

// Interface pour le quiz (ajoutée plus tard, mais nécessaire pour l'étape 5)
export interface QuizQuestion {
  id: number;
  scenario: string;
  isPhishing: boolean;
  explanation: string;
}

// Liste des questions du quiz
const PHISHING_QUIZ: QuizQuestion[] = [
  // ... (inclure les deux questions que j'ai données précédemment)
  // Question 1
  {
    id: 1,
    scenario: "Objet: Alerte de Sécurité Immédiate - Votre compte a été suspendu.\nCher client, veuillez cliquer sur ce lien [http://secure-login-votre-banque.com] dans les 12 heures pour le vérifier, sinon il sera fermé définitivement.",
    isPhishing: true,
    explanation: "C'est probablement du phishing : l'urgence, la menace de suspension et la demande de cliquer sur un lien pour 'vérifier' sont des tactiques classiques.",
  },
  // Question 2
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

  // 1. Point d'entrée principal pour l'analyse
  public analyzeInput(input: string): AnalysisResult {
    const text = input.trim().toLowerCase();
    let score = 0;
    const details: { rule: string, points: number }[] = [];

    // --- RÈGLES HEURISTIQUES SIMPLES ---

    // 1. Détection des mots-clés d'urgence ou financiers (Phishing par e-mail)
    const urgentKeywords = ['urgent', 'immédiat', 'vérification', 'suspendu', 'facture', 'paiement', 'compromis', 'cliquez ici'];
    for (const keyword of urgentKeywords) {
      if (text.includes(keyword)) {
        score += 15;
        details.push({ rule: `Mot-clé d'urgence ou financier détecté : "${keyword}"`, points: 15 });
      }
    }

    // 2. Analyse des URLs suspectes (si l'input est une URL)
    if (text.startsWith('http')) {
      // Points pour une URL très longue (souvent pour masquer la fin)
      if (text.length > 80) {
        score += 10;
        details.push({ rule: "URL très longue (longueur > 80 caractères)", points: 10 });
      }
      
      // Points pour l'usage du symbole '-' dans le nom de domaine (typosquatting)
      // Ex: www.p-aypal.com ou www.am-azon.com
      if (text.match(/:\/\/([a-z0-9-]+\.){2,}[a-z]+/)) {
          if (text.split('-').length > 2) {
              score += 20;
              details.push({ rule: "Présence inhabituelle de tirets (-) dans le nom de domaine", points: 20 });
          }
      }
      
      // Points si l'URL contient une adresse IP au lieu d'un nom de domaine
      if (text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          score += 30;
          details.push({ rule: "L'URL utilise une adresse IP brute au lieu d'un nom de domaine", points: 30 });
      }
    }
    
    // --- Détermination du Niveau de Risque ---

    let level: 'safe' | 'suspicious' | 'danger';
    if (score < 20) {
      level = 'safe';
    } else if (score < 50) {
      level = 'suspicious';
    } else {
      level = 'danger';
    }
    
    // Assurer qu'il y a toujours un détail de base si le score est zéro
    if (details.length === 0) {
        details.push({ rule: "Aucun indicateur de phishing simple détecté.", points: 0 });
    }

    return { score, level, details };
  }
  
  // 2. Méthode pour récupérer les questions du quiz
  getQuizQuestions(): QuizQuestion[] {
    return PHISHING_QUIZ;
  }
}
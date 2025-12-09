// src/app/tab1/tab1.page.ts

import { Component } from '@angular/core';
import { PhishingService, AnalysisResult } from '../services/phishing'; // <-- Utilisez le chemin corrigé
import { CommonModule } from '@angular/common'; // Pour *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms'; // Pour [(ngModel)]
import { IonicModule } from '@ionic/angular'; // Pour toutes les balises ion-

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  
  // 1. DÉCLARATION STANDALONE : rend ce composant indépendant d'un module
  standalone: true, 
  
  // 2. IMPORTS DIRECTS : inclut tous les modules nécessaires
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule
    // Nous n'importons pas Tab1PageRoutingModule ici car le routage est géré par tabs-routing
  ]
})
export class Tab1Page {
  
  // Variables pour l'interface
  userInput: string = ''; 
  analysisResult: AnalysisResult | null = null; 
  
  constructor(private phishingService: PhishingService) {} 

  public analyze() {
    if (this.userInput.trim().length === 0) {
      this.analysisResult = null;
      return; 
    }
    this.analysisResult = this.phishingService.analyzeInput(this.userInput);
  }
  
  public resetAnalysis() {
    this.userInput = '';
    this.analysisResult = null;
  }
}
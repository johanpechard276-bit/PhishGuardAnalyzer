// src/app/tab1/tab1.page.ts

import { Component } from '@angular/core';
import { PhishingService, AnalysisResult } from '../services/phishing'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  
  // 1. DÉCLARATION STANDALONE (OBLIGATOIRE)
  standalone: true, 
  
  // 2. IMPORTS DIRECTS du HTML
  imports: [
    IonicModule,
    CommonModule, 
    FormsModule,
  ]
})
export class Tab1Page {
  
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
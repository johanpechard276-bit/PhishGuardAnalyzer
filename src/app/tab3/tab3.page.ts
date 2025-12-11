// src/app/tab3/tab3.page.ts

import { Component, OnInit } from '@angular/core';
import { PhishingService, SecurityTip, Alert } from '../services/phishing'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule, FormsModule, IonIcon]
})
export class Tab3Page implements OnInit {
  
  alerts: Alert[] = [];
  tips: SecurityTip[] = [];
  
  constructor(private phishingService: PhishingService) {}

  ngOnInit() {
    this.alerts = this.phishingService.getPhishingAlerts();
    this.tips = this.phishingService.getSecurityTips();
  }
  
  // Fonction utilitaire pour la couleur des alertes
  getAlertColor(level: 'high' | 'medium' | 'low'): string {
    switch (level) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'primary';
    }
  }
}
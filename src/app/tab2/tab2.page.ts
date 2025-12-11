// src/app/tab2/tab2.page.ts

import { Component, OnInit } from '@angular/core';
import { PhishingService, QuizQuestion } from '../services/phishing'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true, // Nouvelle déclaration
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab2Page implements OnInit {

  questions: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  score: number = 0;
  quizCompleted: boolean = false;
  userAnswer: boolean | null = null;
  showResult: boolean = false;
  isCorrect: boolean = false;

  constructor(private phishingService: PhishingService) {}

  ngOnInit() {
    this.loadQuiz();
  }

  loadQuiz() {
    this.questions = this.phishingService.getQuizQuestions();
    this.shuffleArray(this.questions); 
    this.resetQuiz();
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
    this.userAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
  }

  getCurrentQuestion(): QuizQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  submitAnswer(answer: boolean) {
    if (this.showResult) return; 

    this.userAnswer = answer;
    const currentQ = this.getCurrentQuestion();

    if (currentQ) {
      this.isCorrect = (answer === currentQ.isPhishing);
      this.showResult = true;

      if (this.isCorrect) {
        this.score++;
      }
    }
  }

  nextQuestion() {
    this.showResult = false;
    this.userAnswer = null;
    this.isCorrect = false;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.quizCompleted = true;
    }
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
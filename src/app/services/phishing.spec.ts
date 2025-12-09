import { TestBed } from '@angular/core/testing';

import { PhishingService } from './phishing';

describe('PhishingService', () => {
  let service: PhishingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhishingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Tests supplémentaires pour valider la logique
  it('should return safe result for safe input', () => {
    const result = service.analyzeInput('ceci est un texte normal');
    expect(result.level).toBe('safe');
    expect(result.score).toBeLessThan(20);
  });

  it('should detect dangerous keywords', () => {
    const result = service.analyzeInput('urgent cliquez ici votre compte est suspendu');
    expect(result.level).toBe('danger');
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it('should detect suspicious URLs', () => {
    const result = service.analyzeInput('http://www.p-aypal.com/login/verify');
    expect(result.level).toBe('suspicious');
    expect(result.details.some(d => d.rule.includes('tirets'))).toBeTrue();
  });

  it('should detect IP addresses in URLs', () => {
    const result = service.analyzeInput('http://192.168.1.1/login');
    expect(result.score).toBeGreaterThanOrEqual(30);
    expect(result.details.some(d => d.rule.includes('adresse IP'))).toBeTrue();
  });
});
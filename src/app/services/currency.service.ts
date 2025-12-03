import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  // Public, free API with CORS enabled and no API key
  // Docs: https://www.exchangerate-api.com/docs/free
  // Example: https://open.er-api.com/v6/latest/EUR
  private apiUrl = 'https://open.er-api.com/v6/latest';
  private baseCurrency = 'EUR';

  // Fallback static rates relative to EUR (approximate)
  // 1 EUR = rate_in_currency
  private static FALLBACK_EUR_RATES: Record<string, number> = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.85,
    TND: 3.30,
    AED: 3.95,
    SAR: 4.05,
    QAR: 3.95,
    EGP: 51,
    JPY: 165,
    CNY: 7.8,
    CAD: 1.45,
    AUD: 1.65,
    CHF: 0.97,
    TRY: 36,
    MAD: 10.8,
    DZD: 145,
    LYD: 5.2,
    OMR: 0.42,
    KWD: 0.30,
    BHD: 0.40
  };

  private rates: Record<string, number> = { ...CurrencyService.FALLBACK_EUR_RATES };
  private lastLoadedAt: number | null = null;
  private isLoading = false;

  constructor(private http: HttpClient) {}

  /**
   * Load exchange rates from the live API (with 1h caching) and
   * merge them with our fallback table as a safety net.
   */
  loadRates(force = false): Observable<Record<string, number>> {
    const now = Date.now();

    if (
      !force &&
      this.lastLoadedAt &&
      now - this.lastLoadedAt < 60 * 60 * 1000 && // 1 hour cache
      !this.isLoading
    ) {
      return of(this.rates);
    }

    if (this.isLoading) {
      // A request is already in-flight, just return current rates
      return of(this.rates);
    }

    this.isLoading = true;

    const url = `${this.apiUrl}/${this.baseCurrency}`;

    return this.http.get<{ rates: Record<string, number> }>(url).pipe(
      map(response => response?.rates || {}),
      tap(apiRates => {
        // Merge API rates with fallback table
        this.rates = {
          ...CurrencyService.FALLBACK_EUR_RATES,
          ...apiRates,
          [this.baseCurrency]: 1
        };
        this.lastLoadedAt = Date.now();
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des taux de change depuis l\'API :', error);
        // Keep using whatever rates we already have (fallback or previous load)
        this.isLoading = false;
        return of(this.rates);
      })
    );
  }

  /**
   * Convert an amount from one currency to another using current rates.
   * If conversion is not possible, returns the original amount.
   */
  convert(amount: number, from: string, to: string): number {
    if (!amount || from === to) {
      return amount;
    }

    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    if (!fromRate || !toRate) {
      return amount;
    }

    // amount is in "from" currency.
    // First convert to EUR, then to target currency.
    const amountInEur = amount / fromRate;
    return amountInEur * toRate;
  }
}


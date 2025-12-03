import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  phoneLength?: number; // Expected phone number length (without country code)
}

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.css'
})
export class CountrySelectorComponent implements OnInit {
  @Input() selectedCountry: Country | null = null;
  @Output() countrySelected = new EventEmitter<Country>();

  isOpen = false;
  searchQuery = '';
  searchKey = '';

  countries: Country[] = [
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', phoneLength: 8 },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', phoneLength: 9 },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', phoneLength: 9 },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', phoneLength: 9 },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', phoneLength: 10 },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', phoneLength: 9 },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', phoneLength: 10 },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', phoneLength: 10 },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', phoneLength: 11 },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', phoneLength: 10 },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', phoneLength: 9 },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', phoneLength: 9 },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', phoneLength: 9 },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', phoneLength: 8 },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', phoneLength: 8 },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', phoneLength: 8 },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', phoneLength: 8 },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', phoneLength: 9 },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', phoneLength: 8 },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', phoneLength: 10 },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', phoneLength: 10 },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', phoneLength: 9 },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', phoneLength: 11 },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', phoneLength: 10 },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', phoneLength: 10 },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', phoneLength: 11 },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', phoneLength: 10 },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', phoneLength: 10 },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', phoneLength: 9 },
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', phoneLength: 10 },
  ];

  filteredCountries: Country[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredCountries = this.countries;
    if (!this.selectedCountry) {
      // Default to Tunisia
      this.selectedCountry = this.countries.find(c => c.code === 'TN') || this.countries[0];
      this.countrySelected.emit(this.selectedCountry);
    }
  }

  get filteredCountriesList(): Country[] {
    if (!this.searchQuery) {
      return this.countries;
    }
    const query = this.searchQuery.toLowerCase();
    return this.countries.filter(country =>
      country.name.toLowerCase().startsWith(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().startsWith(query)
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.searchKey = '';
    }
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.countrySelected.emit(country);
    this.isOpen = false;
    this.searchQuery = '';
    this.searchKey = '';
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.searchQuery = '';
      this.searchKey = '';
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    // If a letter is pressed, jump to countries starting with that letter
    if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
      event.preventDefault();
      this.searchKey = event.key.toLowerCase();
      const matchingCountries = this.countries.filter(c =>
        c.name.toLowerCase().startsWith(this.searchKey)
      );
      if (matchingCountries.length > 0) {
        this.searchQuery = this.searchKey;
        // Scroll to first matching country
        setTimeout(() => {
          const firstMatch = document.querySelector(`[data-country-code="${matchingCountries[0].code}"]`);
          if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 0);
      }
    } else if (event.key === 'Escape') {
      this.isOpen = false;
      this.searchQuery = '';
      this.searchKey = '';
    }
  }
}


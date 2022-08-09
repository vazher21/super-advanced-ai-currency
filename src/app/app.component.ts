import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { CurrencyService } from './currency.service';
import { debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    left: new FormGroup({
      currency: new FormControl('gel'),
      amount: new FormControl<number>(1),
    }),
    right: new FormGroup({
      currency: new FormControl<string>('usd'),
      amount: new FormControl<number>(0),
    }),
  });

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.registerValueChanges();
  }

  registerValueChanges() {
    this.leftAmount.valueChanges
      .pipe(
        debounceTime(200),
        tap(() => this.calculateFromLeft())
      )
      .subscribe();

    this.leftCurrency.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => this.calculateFromLeft())
      )
      .subscribe();

    this.rightCurrency.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => this.calculateFromRight())
      )
      .subscribe();

    this.rightAmount.valueChanges
      .pipe(
        debounceTime(200),
        tap(() => this.calculateFromRight())
      )
      .subscribe();

    // will fire valueChanges.
    this.leftAmount.updateValueAndValidity();
  }

  calculateFromLeft() {
    this.currencyService
      .getRate(this.leftCurrency.value, this.rightCurrency.value)
      .subscribe((rate) => {
        const result = this.leftAmount.value * rate;
        this.rightAmount.setValue(result.toFixed(2), { emitEvent: false });
      });
  }

  calculateFromRight() {
    this.currencyService
      .getRate(this.leftCurrency.value, this.rightCurrency.value)
      .subscribe((rate) => {
        const result = this.rightAmount.value / rate;
        this.leftAmount.setValue(result.toFixed(2), { emitEvent: false });
      });
  }

  // Form Getters
  get left(): FormGroup {
    return this.form.get('left') as FormGroup;
  }
  get right(): FormGroup {
    return this.form.get('right') as FormGroup;
  }

  get leftCurrency(): FormControl {
    return this.left.get('currency') as FormControl;
  }
  get leftAmount(): FormControl {
    return this.left.get('amount') as FormControl;
  }
  get rightCurrency(): FormControl {
    return this.right.get('currency') as FormControl;
  }
  get rightAmount(): FormControl {
    return this.right.get('amount') as FormControl;
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-form-validator',
  templateUrl: './form-validator.component.html',
  styleUrls: ['./form-validator.component.css']
})
export class FormValidatorComponent implements OnInit {
  public detailsForm: FormGroup;
  public cardLogo: string;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.detailsForm = this.formBuilder.group({
      number: ["", Validators.required],
      cvv: ["", Validators.required]
    });
  }

  onInput() {
    const eneteredNumber = this.detailsForm.get('number').value;
    if (eneteredNumber.length >= 6 && !this.cardLogo) {
      this.cardLogo = 'cardLogo';
      this.getCardDetails(eneteredNumber).subscribe((cardDetails) => {
        this.cardLogo = cardDetails.type;
        this.overrideValidators(cardDetails);
      });
    } else if (eneteredNumber.length <= 6) {
      this.cardLogo = '';
    }

    // const eneteredNumber = this.detailsForm.get('number').value;
    // this.getCardDetails(eneteredNumber).subscribe((cardDetails) => {
    //   this.cardLogo = cardDetails.type;
    //   this.overrideValidators(cardDetails);
    // });
    // if (eneteredNumber.length <= 0) {
    //   this.cardLogo = '';
    // }

  }

  overrideValidators(cardDetails: any) {
   this.detailsForm.controls['number'].setValidators([Validators.required, Validators.minLength(cardDetails.minLength),
     Validators.maxLength(cardDetails.maxLength)]);
   this.detailsForm.controls['number'].updateValueAndValidity();
    this.detailsForm.controls['cvv'].setValidators([Validators.required, Validators.minLength(cardDetails.cvvLength),
      Validators.maxLength(cardDetails.cvvLength)]);
    this.detailsForm.controls['cvv'].updateValueAndValidity();
    console.log(this.detailsForm);

  }

  getCardDetails(cardNumber: string): Observable<any>{
    let cardDetails;
    switch(true) {
      case /^4\d*$/.test(cardNumber):
        cardDetails = {
          type: 'VISA',
          minLength: 16,
          maxLength: 19,
          cvvLength: 4
        };
        break;
      case /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)\d*$/.test(cardNumber):
        cardDetails = {
          type: 'MASTERCARD',
          minLength: 16,
          maxLength: 16,
          cvvLength: 3
        };
        break;
      case /^3[47]\d*$/.test(cardNumber):
        cardDetails = {
          type: 'AMERICAN_EXPRESS',
          minLength: 15,
          maxLength: 15,
          cvvLength: 4
        };
        break;
      case /^3(0[0-5]|[689])\d*$/.test(cardNumber):
        cardDetails = {
          type: 'DINERS_CLUB',
          minLength: 14,
          maxLength: 19,
          cvvLength: 3
        };
        break;
      case /^(6011|65|64[4-9])\d*$/.test(cardNumber):
        cardDetails = {
          type: 'DISCOVER',
          minLength: 16,
          maxLength: 19,
          cvvLength: 3
        };
        break;
      case /^(2131|1800|35)\d*$/.test(cardNumber):
        cardDetails = {
          type: 'VISA',
          minLength: 16,
          maxLength: 19,
          cvvLength: 3
        };
        break;
      case /^(((620|(621(?!83|88|98|99))|622(?!06|018)|62[3-6]|627[02,06,07]|628(?!0|1)|629[1,2]))\d*|622018\d{12})$/.test(cardNumber):
        cardDetails = {
          type: 'UNIONPAY',
          minLength: 16,
          maxLength: 19,
          cvvLength: 3
        };
        break;
      case /^(5[06-9]|6[37])\d*$/.test(cardNumber):
        cardDetails = {
          type: 'MAESTRO',
          minLength: 12,
          maxLength: 19,
          cvvLength: 3
        };
        break;
      default:
        cardDetails = {};
    }
    return Observable.of(cardDetails);
  }

}

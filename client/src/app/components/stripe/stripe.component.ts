import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeyRetrievalService } from 'src/app/services/keyRetrieval.service';

interface PaymentIntentResponse {
  clientSecret: string;
}

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  paymentError: string | undefined;
  stripePK = ''
  response$!: Promise<any>

  constructor(private http: HttpClient, private router:Router, private keyRetvlSvc: KeyRetrievalService) {}

  async ngOnInit() {
    this.response$ = this.keyRetvlSvc.getStripePublishableKey()
    .then((response: { key: string; }) => {
      this.stripePK = response.key
      this.initializeStripe();
    })
    .catch((error: any) => {
      console.error(error);
    })
  }

    async initializeStripe() {
      const stripe = await loadStripe(this.stripePK);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }
      
      this.stripe = stripe;
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }

  checkout() {
    this.http.post<PaymentIntentResponse>('/createpaymentintent', {})
      .subscribe({
        next: (response) => this.confirmPayment(response.clientSecret),
        error: (err) => this.paymentError = "Payment Intent failed to be created",
      });
  }

  async confirmPayment(clientSecret: string) {
    if (this.stripe && this.card) {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
        },
      });


      if (error) {
        this.paymentError = error.message;
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('Payment succeeded');
        this.paymentError = 'Payment succeeded! Thank you!';
        setTimeout(() => this.router.navigate(['/']), 2000);
      } else {
        console.log('Payment failed');
        this.paymentError = 'Payment failed, please try again';
      }
    }
  }

}

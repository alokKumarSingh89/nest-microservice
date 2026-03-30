/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const key: string = this.configService.get<string>('STRIPE_SECRET_KEY')!;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.stripe = new Stripe(key);
  }

  async createCharge({ amount }: CreateChargeDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const paymentIntent = await this.stripe.paymentIntents.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa', // Use a test card for simplicity
      payment_method_types: ['card'],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return paymentIntent;
  }
}

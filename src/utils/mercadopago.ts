import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Create a singleton instance of MercadoPagoConfig
let mpConfig: MercadoPagoConfig | null = null;

export function getMercadoPagoConfig(): MercadoPagoConfig {
  if (!mpConfig) {
    mpConfig = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });
  }
  return mpConfig;
}

// Helper function to get Payment instance
export function getPaymentClient(): Payment {
  return new Payment(getMercadoPagoConfig());
}

// Helper function to get Preference instance
export function getPreferenceClient(): Preference {
  return new Preference(getMercadoPagoConfig());
}

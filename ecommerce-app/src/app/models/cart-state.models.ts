import { Datos } from "../../datos";

/**
 * Estado 1: CartState - Estado principal del carrito
 * Contiene los items del carrito y metadatos básicos
 */
export interface CartState {
  items: Datos[];
  totalItems: number;
  lastUpdated: Date | null;
}

/**
 * Estado 2: CartUIState - Estado de la interfaz de usuario
 * Contiene información sobre el estado de la UI del carrito
 */

export interface CartUIState {
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  isProcessing: boolean; // Para operaciones asíncronas
}

/**
 * Estado 3: CartSummaryState - Estado del resumen del carrito
 * Contiene cálculos y resumen financiero del carrito
 */
export interface CartSummaryState {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

/**
 * Estado combinado del carrito (opcional, para facilitar el acceso)
 */
export interface CombinedCartState {
  cart: CartState;
  ui: CartUIState;
  summary: CartSummaryState;
}

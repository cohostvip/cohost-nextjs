'use client';

import { useState } from 'react';
import { usePaymentElement, type CreditCardInformation } from '@cohostvip/cohost-react';

interface PaymentFormProps {
  className?: string;
  onTokenized?: (tokenData: any) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ className, onTokenized, onError }: PaymentFormProps) {
  const { tokenizeCard } = usePaymentElement();

  const [formData, setFormData] = useState<CreditCardInformation>({
    cardNumber: '',
    month: 0,
    year: 0,
    cardCode: '',
    nameOnCard: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (field: keyof CreditCardInformation, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = 'Valid month is required';
    }

    const currentYear = new Date().getFullYear() % 100;
    if (!formData.year || formData.year < currentYear) {
      newErrors.year = 'Valid year is required';
    }

    if (!formData.cardCode || formData.cardCode.length < 3) {
      newErrors.cardCode = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsProcessing(true);
    try {
      const tokenData = await tokenizeCard({
        ...formData,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
      });
      onTokenized?.(tokenData);
    } catch (err: any) {
      const message = err?.message || 'Payment processing failed';
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-text">Payment Information</h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-text-muted">
          Name on Card
        </label>
        <input
          type="text"
          value={formData.nameOnCard}
          onChange={(e) => handleChange('nameOnCard', e.target.value)}
          className={`w-full rounded-md border bg-background px-3 py-2 text-text placeholder:text-text-subtle focus:outline-none focus:ring-1 ${
            errors.nameOnCard
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-border focus:border-accent focus:ring-accent'
          }`}
          placeholder="John Doe"
        />
        {errors.nameOnCard && (
          <p className="mt-1 text-xs text-red-500">{errors.nameOnCard}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text-muted">
          Card Number
        </label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
          className={`w-full rounded-md border bg-background px-3 py-2 text-text placeholder:text-text-subtle focus:outline-none focus:ring-1 ${
            errors.cardNumber
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-border focus:border-accent focus:ring-accent'
          }`}
          placeholder="4111 1111 1111 1111"
          maxLength={19}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Month
          </label>
          <select
            value={formData.month || ''}
            onChange={(e) => handleChange('month', parseInt(e.target.value) || 0)}
            className={`w-full rounded-md border bg-background px-3 py-2 text-text focus:outline-none focus:ring-1 ${
              errors.month
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-border focus:border-accent focus:ring-accent'
            }`}
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="mt-1 text-xs text-red-500">{errors.month}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Year
          </label>
          <select
            value={formData.year || ''}
            onChange={(e) => handleChange('year', parseInt(e.target.value) || 0)}
            className={`w-full rounded-md border bg-background px-3 py-2 text-text focus:outline-none focus:ring-1 ${
              errors.year
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-border focus:border-accent focus:ring-accent'
            }`}
          >
            <option value="">YY</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = (new Date().getFullYear() % 100) + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          {errors.year && (
            <p className="mt-1 text-xs text-red-500">{errors.year}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            CVV
          </label>
          <input
            type="text"
            value={formData.cardCode}
            onChange={(e) => handleChange('cardCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
            className={`w-full rounded-md border bg-background px-3 py-2 text-text placeholder:text-text-subtle focus:outline-none focus:ring-1 ${
              errors.cardCode
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-border focus:border-accent focus:ring-accent'
            }`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cardCode && (
            <p className="mt-1 text-xs text-red-500">{errors.cardCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { PaymentForm as default };

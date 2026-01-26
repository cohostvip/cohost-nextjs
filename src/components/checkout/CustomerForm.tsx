'use client';

import { useState, useEffect } from 'react';
import { useCohostCheckout } from '@cohostvip/cohost-react';

interface CustomerFormProps {
  className?: string;
  onValidChange?: (isValid: boolean) => void;
}

export function CustomerForm({ className, onValidChange }: CustomerFormProps) {
  const { cartSession, setCustomer } = useCohostCheckout();

  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing customer data
  useEffect(() => {
    if (cartSession?.customer) {
      setFormData({
        first: cartSession.customer.first || '',
        last: cartSession.customer.last || '',
        email: cartSession.customer.email || '',
        phone: cartSession.customer.phone || '',
      });
    }
  }, [cartSession?.customer]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first.trim()) {
      newErrors.first = 'First name is required';
    }
    if (!formData.last.trim()) {
      newErrors.last = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidChange?.(isValid);
    return isValid;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = async () => {
    if (validate()) {
      await setCustomer(formData);
    }
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            First Name
          </label>
          <input
            type="text"
            value={formData.first}
            onChange={(e) => handleChange('first', e.target.value)}
            onBlur={handleBlur}
            className={`w-full rounded-md border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 ${
              errors.first
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-text-subtle focus:border-accent focus:ring-accent'
            }`}
            placeholder="Jane"
          />
          {errors.first && (
            <p className="mt-1 text-xs text-red-500">{errors.first}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last}
            onChange={(e) => handleChange('last', e.target.value)}
            onBlur={handleBlur}
            className={`w-full rounded-md border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 ${
              errors.last
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-text-subtle focus:border-accent focus:ring-accent'
            }`}
            placeholder="Smith"
          />
          {errors.last && (
            <p className="mt-1 text-xs text-red-500">{errors.last}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={handleBlur}
          className={`w-full rounded-md border bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 ${
            errors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-text-subtle focus:border-accent focus:ring-accent'
          }`}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={handleBlur}
          className="w-full rounded-md border border-text-subtle bg-surface px-3 py-2 text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  );
}

'use client';

import { Button } from './Button';

interface QuantitySelectorProps {
  /** Current quantity */
  qty: number;
  /** Minimum purchase quantity (clicking + from 0 jumps to this value) */
  min?: number;
  /** Maximum quantity per user for this ticket type */
  max?: number;
  /** Step increment (default: 1) */
  increment?: number;
  /** Callback when quantity changes */
  onChange: (newQty: number) => void;
  /** Disable the control */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    button: 'h-7 w-7',
    text: 'w-6 text-sm',
  },
  md: {
    button: 'h-8 w-8',
    text: 'w-8 text-base',
  },
  lg: {
    button: 'h-10 w-10',
    text: 'w-10 text-lg',
  },
};

export function QuantitySelector({
  qty,
  min = 1,
  max = Infinity,
  increment = 1,
  onChange,
  disabled = false,
  size = 'md',
}: QuantitySelectorProps) {
  // Can decrement if qty > 0 (goes to 0 or decrements by increment)
  const canDecrement = qty > 0;
  // Can increment if adding increment won't exceed max
  const canIncrement = qty === 0 ? min <= max : qty + increment <= max;

  const handleDecrement = () => {
    if (!canDecrement) return;

    if (qty <= min) {
      // At or below min, go back to 0
      onChange(0);
    } else {
      // Normal decrement
      onChange(qty - increment);
    }
  };

  const handleIncrement = () => {
    if (!canIncrement) return;

    if (qty === 0) {
      // From 0, jump to min
      onChange(min);
    } else {
      // Normal increment
      onChange(qty + increment);
    }
  };

  const styles = sizeStyles[size];

  return (
    <div className="flex items-center gap-2" data-testid="quantity-selector">
      <Button
        size="sm"
        variant="secondary"
        onClick={handleDecrement}
        disabled={disabled || !canDecrement}
        className={`${styles.button} p-0`}
        aria-label="Decrease quantity"
        data-testid="quantity-decrement"
      >
        −
      </Button>
      <span
        className={`${styles.text} text-center font-medium text-text tabular-nums`}
        data-testid="quantity-value"
      >
        {qty}
      </span>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleIncrement}
        disabled={disabled || !canIncrement}
        className={`${styles.button} p-0`}
        aria-label="Increase quantity"
        data-testid="quantity-increment"
      >
        +
      </Button>
    </div>
  );
}

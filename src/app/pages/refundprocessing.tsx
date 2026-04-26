import React, { useState } from 'react';

// Types
interface RefundRequest {
  bookingId: string;
  amount: number;
  reason: string;
  bookingTime: string; // new
}

interface ValidationErrors {
  bookingId?: string;
  amount?: string;
  reason?: string;
  bookingTime?: string;
}

type RefundStatus = 'processing' | 'completed' | 'failed';

const RefundProcessor: React.FC = () => {
  const [refundRequest, setRefundRequest] = useState<RefundRequest>({
    bookingId: '',
    amount: 0,
    reason: '',
    bookingTime: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundStatus, setRefundStatus] = useState<RefundStatus | null>(null);
  const [result, setResult] = useState('');

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!refundRequest.bookingId.trim()) {
      newErrors.bookingId = 'Booking ID is required';
    }

    if (refundRequest.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!refundRequest.reason.trim()) {
      newErrors.reason = 'Select a reason';
    }

    if (!refundRequest.bookingTime) {
      newErrors.bookingTime = 'Booking time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setRefundRequest(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  // ✅ Refund Logic (MAIN PART)
  const calculateRefund = () => {
    const bookingTime = new Date(refundRequest.bookingTime).getTime();
    const currentTime = Date.now();

    const hoursDiff = (bookingTime - currentTime) / (1000 * 60 * 60);

    if (hoursDiff >= 2) return refundRequest.amount;
    if (hoursDiff > 0) return refundRequest.amount * 0.5;
    return 0;
  };

  // ✅ Process Refund
  const processRefund = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setRefundStatus('processing');

    await new Promise(res => setTimeout(res, 1500));

    const refundAmount = calculateRefund();

    setIsProcessing(false);
    setRefundStatus('completed');

    setResult(
      `Refund: ${refundAmount} BDT | Status: ${
        refundAmount === 0 ? 'No Refund' :
        refundAmount === refundRequest.amount ? 'Full Refund' : 'Partial Refund'
      }`
    );
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>ReserveX Refund System</h2>

      {/* Booking ID */}
      <input
        type="text"
        name="bookingId"
        placeholder="Booking ID"
        value={refundRequest.bookingId}
        onChange={handleChange}
      />
      <p>{errors.bookingId}</p>

      {/* Amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={refundRequest.amount}
        onChange={handleChange}
      />
      <p>{errors.amount}</p>

      {/* Booking Time */}
      <input
        type="datetime-local"
        name="bookingTime"
        value={refundRequest.bookingTime}
        onChange={handleChange}
      />
      <p>{errors.bookingTime}</p>

      {/* Reason */}
      <select name="reason" value={refundRequest.reason} onChange={handleChange}>
        <option value="">Select Reason</option>
        <option value="cancel">Customer Cancelled</option>
        <option value="restaurant">Restaurant Issue</option>
      </select>
      <p>{errors.reason}</p>

      <button onClick={processRefund} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Process Refund'}
      </button>

      {refundStatus === 'completed' && (
        <p style={{ marginTop: 20 }}>{result}</p>
      )}
    </div>
  );
};

export default RefundProcessor;
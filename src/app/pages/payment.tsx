import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CreditCard, Smartphone, Banknote, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { paymentService } from '../services/payment.service';
import { bookingService } from '../services/booking.service';

type PaymentMethod = 'card' | 'bkash' | 'nagad' | 'rocket';

interface BookingSummary {
  bookingId: string;
  restaurantName: string;
  date: string;
  timeSlot: string;
  seats: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Mobile banking form state (for bKash, Nagad, Rocket)
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobilePin, setMobilePin] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please login to complete payment');
      navigate('/auth');
      return;
    }

    // Retrieve booking data from navigation state
    const state = location.state as { booking?: BookingSummary };
    if (!state?.booking) {
      toast.error('No booking information found');
      navigate('/restaurants');
      return;
    }

    setBooking(state.booking);
  }, [isAuthenticated, location.state, navigate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const validateCardForm = () => {
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardCvv.match(/^\d{3}$/)) {
      toast.error('Please enter a valid 3-digit CVV');
      return false;
    }
    if (!cardName.trim()) {
      toast.error('Please enter the name on card');
      return false;
    }
    return true;
  };

  const validateMobileForm = () => {
    if (!mobileNumber.match(/^01\d{9}$/)) {
      toast.error('Please enter a valid Bangladeshi mobile number (01XXXXXXXXX)');
      return false;
    }
    if (!mobilePin.match(/^\d{4,6}$/)) {
      toast.error('Please enter a valid PIN (4-6 digits)');
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    // Validate based on selected method
    let isValid = false;
    let paymentDetails: any = {};

    if (paymentMethod === 'card') {
      isValid = validateCardForm();
      paymentDetails = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry: cardExpiry,
        cvv: cardCvv,
        cardholderName: cardName,
      };
    } else {
      isValid = validateMobileForm();
      paymentDetails = {
        mobileNumber,
        pin: mobilePin,
      };
    }

    if (!isValid) return;

    setIsProcessing(true);

    try {
      // Process payment via service
      const paymentResult = await paymentService.processPayment({
        bookingId: booking.bookingId,
        amount: booking.totalAmount,
        method: paymentMethod,
        details: paymentDetails,
      });

      if (paymentResult.success) {
        // Update booking status to confirmed
        await bookingService.confirmBooking(booking.bookingId, paymentResult.transactionId);

        toast.success('Payment successful! Your booking is confirmed.');
        navigate('/bookings', { state: { success: true } });
      } else {
        toast.error(paymentResult.message || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold mt-4">Complete Payment</h1>
          <p className="text-muted-foreground mt-2">
            Secure payment to confirm your booking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restaurant</span>
                <span className="font-semibold">{booking.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{booking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span>{booking.seats}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>৳{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  paymentMethod === 'bkash'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">bKash</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  paymentMethod === 'nagad'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Nagad</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry (MM/YY)</Label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        maxLength={5}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={handleCardCvvChange}
                        maxLength={3}
                        required
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Name on Card</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </>
              )}

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                <>
                  <div>
                    <Label>Mobile Number</Label>
                    <Input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>PIN</Label>
                    <Input
                      type="password"
                      placeholder="Enter your PIN"
                      value={mobilePin}
                      onChange={(e) => setMobilePin(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ৳${booking.totalAmount.toLocaleString()}`
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4 inline mr-1" />
          Your payment information is encrypted and secure.
        </div>
      </div>
    </div>
  );
}
import java.util.*;

public class ReserveXRefundSystem {

    // ===================== Booking Class =====================
    static class Booking {
        private int id;
        private long bookingTime;
        private String status;

        public Booking(int id, long bookingTime, String status) {
            this.id = id;
            this.bookingTime = bookingTime;
            this.status = status;
        }

        public int getId() { return id; }
        public long getBookingTime() { return bookingTime; }
        public String getStatus() { return status; }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // ===================== Payment Class =====================
    static class Payment {
        private int bookingId;
        private double amount;
        private String refundStatus;

        public Payment(int bookingId, double amount, String refundStatus) {
            this.bookingId = bookingId;
            this.amount = amount;
            this.refundStatus = refundStatus;
        }

        public int getBookingId() { return bookingId; }
        public double getAmount() { return amount; }
        public String getRefundStatus() { return refundStatus; }

        public void setRefundStatus(String refundStatus) {
            this.refundStatus = refundStatus;
        }
    }

    // ===================== Refund Service =====================
    static class RefundService {

        public double processRefund(Booking booking, Payment payment) {

            // Check if already refunded
            if (payment.getRefundStatus().equals("REFUNDED")) {
                System.out.println("Already refunded!");
                return 0;
            }

            long currentTime = System.currentTimeMillis();
            long bookingTime = booking.getBookingTime();

            // Convert milliseconds to hours
            double hoursDiff = (bookingTime - currentTime) / (1000.0 * 60 * 60);

            double refundAmount;

            // Refund rules
            if (hoursDiff >= 2) {
                refundAmount = payment.getAmount(); // Full refund
            } else if (hoursDiff > 0) {
                refundAmount = payment.getAmount() * 0.5; // 50% refund
            } else {
                refundAmount = 0; // No refund
            }

            // Update status
            payment.setRefundStatus("REFUNDED");
            booking.setStatus("CANCELLED");

            return refundAmount;
        }
    }

    // ===================== Main Method =====================
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.println("===== ReserveX Refund System =====");

        // Input booking time (hours from now)
        System.out.print("Enter hours from now for booking (e.g. 3): ");
        int hours = sc.nextInt();

        // Input amount
        System.out.print("Enter payment amount: ");
        double amount = sc.nextDouble();

        // Convert to future time
        long bookingTime = System.currentTimeMillis() + (hours * 60 * 60 * 1000);

        // Create objects
        Booking booking = new Booking(1, bookingTime, "CONFIRMED");
        Payment payment = new Payment(1, amount, "NOT_REFUNDED");

        RefundService service = new RefundService();

        // Process refund
        double refund = service.processRefund(booking, payment);

        // Output results
        System.out.println("\n===== RESULT =====");
        System.out.println("Refund Amount: " + refund + " BDT");
        System.out.println("Booking Status: " + booking.getStatus());
        System.out.println("Refund Status: " + payment.getRefundStatus());

        sc.close();
    }
}
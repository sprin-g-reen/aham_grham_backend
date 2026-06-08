import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';
import Customer from '../models/Customer.js';

// @desc    Create a Razorpay Order
// @route   POST /api/payment/order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receiptId } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Convert amount to paise (e.g. 500 INR = 50000 Paise)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receiptId || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    console.log(`📡 Creating Razorpay Order for amount: ${amount} INR (${amountInPaise} Paise)`);
    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key'
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay Signature and save order to DB
// @route   POST /api/payment/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customerData 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // 1. Verify Payment Signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.warn('⚠️ Payment signature verification failed (possible tampering)');
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    console.log('✅ Payment signature verified successfully!');

    // 2. Save customer booking/order details to DB if customerData is present
    let savedOrder = null;
    if (customerData) {
      const { name, phone, email, pincode, city, state, address, productName, price } = customerData;
      
      savedOrder = await Customer.create({
        name,
        phone,
        email,
        pincode,
        city,
        state,
        address,
        productName: productName || 'Unknown Product',
        price: parseFloat(price) || 0,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: 'paid'
      });
      console.log(`💾 Order details saved for ${name} - Product: ${productName}`);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and order saved successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Payment verification / DB save error:', error);
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
};

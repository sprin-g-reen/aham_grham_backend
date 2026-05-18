async function run() {
  try {
    console.log('Sending test verification request to production backend...');
    const res = await fetch('https://aham-grham-backend.vercel.app/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: 'fake_order_id',
        razorpay_payment_id: 'fake_payment_id',
        razorpay_signature: 'fake_signature',
        customerData: {
          name: "Test User",
          phone: "9999999999",
          email: "test@example.com",
          pincode: "123456",
          city: "Test City",
          state: "Test State",
          address: "Test Address",
          productName: "Test Product",
          price: 1.00
        }
      })
    });
    
    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();

const testCustomer = {
    name: "Test User",
    phone: "1234567890",
    email: "test@example.com",
    pincode: "123456",
    city: "Test City",
    state: "Test State",
    address: "Test Address"
};

async function test() {
    try {
        console.log("Testing POST /api/customers...");
        const postRes = await fetch('http://localhost:5000/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testCustomer)
        });
        const postData = await postRes.json();
        console.log("POST Status:", postRes.status);
        console.log("POST Response:", postData);

        console.log("Testing GET /api/customers...");
        const getRes = await fetch('http://localhost:5000/api/customers');
        const getData = await getRes.json();
        console.log("GET Status:", getRes.status);
        console.log("GET Response Count:", Array.isArray(getData) ? getData.length : "Not an array");
    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

test();

async function cleanup() {
    try {
        const getRes = await fetch('http://localhost:5000/api/customers');
        const customers = await getRes.json();
        
        const testUser = customers.find(c => c.email === 'test@example.com' || c.name === 'Test User');
        
        if (testUser) {
            console.log("Found test user:", testUser._id);
            const delRes = await fetch(`http://localhost:5000/api/customers/${testUser._id}`, {
                method: 'DELETE'
            });
            console.log("Delete status:", delRes.status);
        } else {
            console.log("Test user not found.");
        }
    } catch (err) {
        console.error("Cleanup failed:", err.message);
    }
}

cleanup();

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('🔐 Testing login...');

    // Login to get token
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sweetshop.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful, got token');

    console.log('🍬 Testing sweets API...');

    // Fetch sweets with authentication
    const sweetsResponse = await fetch(`${API_BASE}/sweets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!sweetsResponse.ok) {
      throw new Error(`Sweets fetch failed: ${sweetsResponse.status}`);
    }

    const sweets = await sweetsResponse.json();
    console.log(`✅ Successfully fetched ${sweets.length} sweets:`);
    sweets.forEach(sweet => {
      console.log(`   - ${sweet.name} (${sweet.category}) - $${sweet.price} (${sweet.quantity} in stock)`);
    });

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();

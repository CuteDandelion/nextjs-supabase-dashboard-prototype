const jwt = require('jsonwebtoken');
const secret = 'uT8K8Az9+L+FTpKO3UIFEd/s1dQtA4KxsN9529snqYA=';
const anonPayload = { iss: 'supabase', role: 'anon', exp: 1983811296 };
const servicePayload = { iss: 'supabase', role: 'service_role', exp: 1983811296 };
console.log('ANON_KEY:', jwt.sign(anonPayload, secret, { algorithm: 'HS256' }));
console.log('SERVICE_KEY:', jwt.sign(servicePayload, secret, { algorithm: 'HS256' }));
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}'
{
  "message": "User successfully logged in!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoic3R1ZGVudDEiLCJpYXQiOjE3ODk3MTkwMzMsImV4cCI6MTc4OTcyMjYzM30.b5w76PMMx-HLhw1zEQo672FPrK7HC9-VX4sEnB6SFc8"
}
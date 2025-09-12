# Phase 7: API Testing Commands

## Test Environment Setup
```bash
# Make sure server is running
npm run dev
# Server should be on http://localhost:3000
```

## 1. Test GET /api/marketplace/all-offers

### Basic request (without auth - should fail)
```bash
curl -X GET "http://localhost:3000/api/marketplace/all-offers" \
  -H "Content-Type: application/json"
```
**Expected:** 401 Unauthorized

### With filters (requires auth token)
```bash
curl -X GET "http://localhost:3000/api/marketplace/all-offers?country=Romania&type=General&urgency=urgent&priceMin=100&priceMax=1000&search=transport&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with filtered cargo list

## 2. Test GET /api/marketplace/my-cargo

### Get all my cargo
```bash
curl -X GET "http://localhost:3000/api/marketplace/my-cargo" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with user's cargo list

### Filter by status
```bash
curl -X GET "http://localhost:3000/api/marketplace/my-cargo?status=Active&page=1&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with filtered cargo list

## 3. Test GET /api/marketplace/my-quotes

### Get all my quotes
```bash
curl -X GET "http://localhost:3000/api/marketplace/my-quotes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with user's quotes list

### Filter by status
```bash
curl -X GET "http://localhost:3000/api/marketplace/my-quotes?status=Pending" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with filtered quotes

## 4. Test GET /api/marketplace/active-deals

### Get all deals (shipper + transporter)
```bash
curl -X GET "http://localhost:3000/api/marketplace/active-deals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with user's deals list

### Filter by role and status
```bash
curl -X GET "http://localhost:3000/api/marketplace/active-deals?role=shipper&status=Active" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```
**Expected:** 200 with filtered deals

## 5. Test POST /api/cargo/create

### Valid cargo creation
```bash
curl -X POST "http://localhost:3000/api/cargo/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Test Cargo Transport",
    "description": "Test cargo for API validation",
    "pickupAddress": "Strada Principala 123",
    "pickupCity": "Bucharest",
    "pickupCountry": "Romania", 
    "pickupDate": "2025-12-01",
    "pickupTimeStart": "09:00",
    "pickupTimeEnd": "12:00",
    "deliveryAddress": "Calea Victoriei 456",
    "deliveryCity": "Cluj-Napoca",
    "deliveryCountry": "Romania",
    "deliveryDate": "2025-12-03",
    "deliveryTimeStart": "14:00",
    "deliveryTimeEnd": "18:00",
    "weight": 500.5,
    "volume": 2.5,
    "cargoType": "General",
    "packaging": "Pallets",
    "specialRequirements": "Handle with care",
    "estimatedValue": 1500.0,
    "budgetMin": 200.0,
    "budgetMax": 400.0,
    "isUrgent": false,
    "isPublic": true
  }'
```
**Expected:** 201 Created with cargo details

### Invalid data (missing required fields)
```bash
curl -X POST "http://localhost:3000/api/cargo/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Test",
    "pickupDate": "2024-01-01"
  }'
```
**Expected:** 400 Bad Request with validation errors

### Invalid dates (pickup after delivery)
```bash
curl -X POST "http://localhost:3000/api/cargo/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Invalid Date Test",
    "pickupAddress": "Address 1",
    "pickupCity": "City 1",
    "pickupCountry": "Country 1",
    "pickupDate": "2025-12-05",
    "deliveryAddress": "Address 2", 
    "deliveryCity": "City 2",
    "deliveryCountry": "Country 2",
    "deliveryDate": "2025-12-01",
    "cargoType": "General"
  }'
```
**Expected:** 400 Bad Request with date validation error

## Test Results Checklist

- [ ] All endpoints require authentication (401 without token)
- [ ] Rate limiting headers present in responses  
- [ ] Filtering works correctly on all GET endpoints
- [ ] Pagination works (page, limit, total, hasNext, hasPrev)
- [ ] Validation errors are detailed and helpful
- [ ] Success responses include proper data structure
- [ ] Database constraints work (user creation, trial limits)
- [ ] Error handling covers edge cases
- [ ] Response times are reasonable (<500ms for simple queries)

## Performance Notes
- Monitor console for any N+1 query issues
- Check Prisma query efficiency with `?logs=query`
- Verify rate limiting works correctly
- Test with multiple users to check authorization isolation
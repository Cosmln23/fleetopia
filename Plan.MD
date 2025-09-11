
     ## STRUCTURA ARHITECTURALĂ

     ### FRONTEND ARCHITECTURE (Next.js 14 + App Router)

     #### Structura Pagini și Navigare
     - **Bara de Sus (Top Bar)**: Fletopia + logo | Mesaje (Messages) + Notificări (Notifications) + Profil
     (Profile) - Clerk
     - **Navigare Principală**: Acasă (Home) | Piața (Marketplace) | Setări (Settings)

     #### ACASĂ (HOME) (/)
     - **Hero Section** cu întrebare pentru vizitatori:
       - Main Question: "Ce cauți astăzi?" sau "How can we help you today?"
       - Două opțiuni mari:
         - **"Am marfă de transportat"** → Direct la Add Cargo modal
         - **"Caut marfă de transportat"** → Direct la Marketplace ALL OFFERS
     - **Quick Actions**
       - **Post Cargo Fast** → AddCargoModal cu formular simplificat
       - **Find Loads** → Marketplace cu filtre pre-setate
       - **Track My Shipments** → Direct la ACTIVE DEALS (dacă e logat)
     - **HowItWorksCards** (3-step explainer)
     - **Testimonial slider** cu feedback real de la utilizatori

     #### PIAȚA (MARKETPLACE) (/marketplace/) - STRUCTURĂ COMPLETĂ

     ##### Layout Principal
     - **Header Superior**:
       - Stânga: ALL OFFERS | MY CARGO | MY QUOTES | ACTIVE DEALS
       - Dreapta: Delete Cargo -- Add Cargo (trigger modal)
     - **Bara de Căutare (Search Bar)**: căutare generală
     - **Filtre de Căutare**: All Countries | Newest First | All Types | All Urgency | Min (preț) | Max (preț) |
     Clear
     - **Grid Principal**: CargoCard components (content variază pe tab)
     - **Modal Overlays**: AddCargoModal + CargoDetailModal

     ##### Pagini Secundare
     - **create/page.tsx** - Formular Adaugă Marfă (backup/full page version)
     - **[id]/page.tsx** - Detalii marfă + istoric cotații

     ##### Componente Principale

     ###### AddCargoModal.tsx - Pop-up Modal Adăugare
     - **Cargo Details**:
       - Cargo Title, Cargo Type (dropdown), Weight (kg) - required
       - Volume (m³) - optional, Vehicle Type (dropdown)
       - Urgency Level (dropdown/buttons)
     - **Route Information**:
       - From Address | To Address, From Country | To Country
       - From Postal Code | To Postal Code, From City | To City
     - **Schedule**: Loading Date (date picker), Delivery Date (date picker)
     - **Price Information**: Total Price (EUR) - input, Price per kg - auto-calculated (readonly)
     - **Actions**: Cancel, Save Draft, Post Cargo

     ###### CargoCard.tsx - Card Compact pe Grid
     - **Display Elements**: Cargo Title, Adresă: Țară (NL) + Oraș + Cod poștal
     - Cargo Type, Weight (kg), Preț, Nume poster

     ###### CargoDetailModal.tsx - Modal Detaliat (click pe card)
     - **Header Section**: Nume + date poster, Verified/Not Verified badge
     - **Cargo Details Section**: Weight & Volume, Cargo Type | Urgency, Loading Date | Delivery Date
     - **Distance Information Section**:
       - From: [adresa completă], To: [adresa completă]
       - Button: "View full route (≈ 1.4k km)" → opens Google Maps
     - **Quote Status Section**: Current status (No quotes/Pending/etc.)
     - **Action Buttons Section**: Send Quote (manual price input), Chat with Shipper, Ignore/Save for Later, Close
     Modal

     ##### Componente de Suport
     - **SearchBar.tsx** - Bara de căutare principală
     - **CargoFilters.tsx** - Bara filtrare (countries, date, types, urgency, price range)
     - **TabNavigation.tsx** - 4 taburi cu logică:
       - **ALL OFFERS**: toate marfurile disponibile (toți utilizatorii)
       - **MY CARGO**: marfa postată de mine (Delete activ aici)
       - **MY QUOTES**: cotațiile trimise de mine
       - **ACTIVE DEALS**: contractele în desfășurare (ambii văd progresul)
     - **StatusBadge.tsx** - Indicatori vizuali status (diferit pe fiecare tab)
     - **QuoteManagement.tsx** - Creare cotație manuală
     - **ChatInterface.tsx** - Mesagerie directă pentru negocieri
     - **DealProgress.tsx** - Tracking progres în ACTIVE DEALS

     ##### Business Logic și Flow
     - **Flow Standard**: Ion postează → MY CARGO (Ion) + ALL OFFERS (toți) → Aurel aplică cotație → MY QUOTES
     (Aurel) + notificare (Ion) → Ion acceptă → ACTIVE DEALS (ambii) + status change
     - **Delete Logic**: activ doar în MY CARGO pentru propriile postări
     - **Action Flow**:
       - **Send Quote** → Manual price input → trimite notificare
       - **Chat with Shipper** → Deschide ChatInterface
       - **Ignore** → Remove din feed personal

     ##### Permissions per Tab
     - **Trial Users**: ALL OFFERS + MY CARGO (limited)
     - **Pro Users**: Toate taburile + cotații + chat

    
     #### SETĂRI (SETTINGS) (/settings/)
     - **page.tsx** - Setări generale (General settings)
     - **account/page.tsx** - Cont (Account) + management abonament (subscription management)
     - **notifications/page.tsx** - Preferințe notificări (Notification preferences)
     - **Componente**: SubscriptionGate.tsx - Control acces Probă vs Pro (Trial vs Pro access control)

     ##### Suport General Frontend
     - **State Management (Zustand)**:, permissions (ex.
     isPro), state persistent (ex. localStorage pentru refresh)
     - **API Integration (SWR/React Query)**: Pentru real-time fetch/mutate (ex. cargo updates, ), WebSockets wrapper (Socket.io pentru push notifications)
     - **Error Handling (Toastify/Custom)**: În modale/panel-uri pentru validation/feedback errors
     - **Performance Optimizations (React.lazy)**: Pentru, ISR pentru
     cache

     ##### Nivele Permisiuni Utilizator
     - **Probă (Trial)** (7/14 zile): Acces limitat la Piața (Marketplace) - postare + vizualizare cargo (ALL
     OFFERS, MY CARGO limitat); chat complet
     - **Pro**: Acces complet - Piața (toate taburile, , chat, quotes) 

     ### BACKEND ARCHITECTURE

     #### HOMEPAGE (Node.js/Express/Prisma/Supabase, deploy Vercel)

     ##### Tech Stack & General Setup
     - **Core Stack**: Node.js v20 cu Express (API routes), Prisma ORM (DB queries type-safe), Supabase (Postgres DB
      + auth/real-time), Clerk pentru token validate (integrat cu Supabase)
     - **Deploy**: Vercel (gratuit inițial, scale auto)

     ##### API Endpoints Necesare
     - **GET /api/home-data** (principal endpoint – returnează tot ce e dynamic pentru Hero/Quick Actions)
     - **POST /api/cargo/quick-post** (pentru Quick Action „Post Cargo Fast")
     - **GET /api/loads/quick-search** (pentru Quick Action „Find Loads")
     - **GET /api/deals/active** (pentru Quick Action „Track My Shipments")

     ##### Database Models
     - **User Model**: id: string (Clerk ID), role: string (Trial/Pro), firstLogin: boolean, subscriptionEnd: date,
     createdAt: date
     - **Cargo Model**: id: uuid, userId: foreign, title: string, fromAddress, toAddress, weight: float, urgency:
     string, price: float, status: string, createdAt: date
     - **Deal Model**: id: uuid, quoteId: foreign, status: string, progress: float, createdAt: date

     #### MARKETPLACE (Node.js cu Express API, Prisma ORM, Supabase DB/Postgres + auth/real-time, Socket.io
     WebSockets; Deploy Vercel)

     ##### Componente Majore
     - **Auth & Permissions**: Clerk integration (middleware pentru token validate, roles Trial/Pro)
     - **DB Modele**:
       - **User**: (id, role)
       - **Cargo**: (id, title, type, weight, volume?, vehicleType, urgency, fromAddress, toAddress, fromCountry,
     toCountry, fromPostal, toPostal, fromCity, toCity, loadingDate, deliveryDate, totalPrice, pricePerKg
     calculated, status, images json[], viewCount, createdAt, updatedAt; relations belongsTo User, hasMany Quote,
     hasOne Deal)
       - **Quote**: (id, cargoId, transporterId, price, estimatedDays, message?, status,   , createdAt, expiresAt; relations belongsTo Cargo, belongsTo User,
     hasOne Deal)
       - **Deal**: (id, cargoId, quoteId, shipperId, transporterId, status, progress, timeline json, totalAmount,
     createdAt, completedAt; relations belongsTo Cargo/Quote, hasMany ChatMessage)
       - **ChatThread**: (id, dealId nullable, quoteId nullable, participants json[userId1, userId2], lastMessageAt,
      isActive bool; hasMany ChatMessage)
       - **ChatMessage**: (id, threadId, senderId, message text, messageType, readAt timestamp nullable, createdAt;
     belongsTo ChatThread/User)
       
     - **API Endpoints**: REST (Express routes pentru CRUD) + WebSockets (Socket.io pentru real-time
     quotes/chat/notifications)
     

     ##### Backend per Pagină Frontend
     - **Tab Navigation Endpoints**:
       - **GET /api/marketplace/all-offers**
       - **GET /api/marketplace/my-cargo**
       - **GET /api/marketplace/my-quotes**
       - **GET /api/marketplace/active-deals**
     - **Cargo Management Endpoints**:
       - **POST /api/cargo/create**
       - **PUT /api/cargo/[id]/update**
       - **DELETE /api/cargo/[id]**
       - **POST /api/cargo/[id]/save-draft**
       - **POST /api/cargo/[id]/ignore**
     - **Quote Management Endpoints**:
       - **POST /api/cargo/[id]/quote**
       - **GET /api/cargo/[id]/quotes**
       - **PUT /api/quotes/[id]/accept**

     ##### Real-time Features
     - **WebSocket Events**: 'new_cargo_posted', 'quote_received', 'quote_accepted', 'deal_status_update',
     'new_message', 'cargo_updated' 
     - **Socket.io Rooms**: 'all_offers_room', 'user_{userId}', 'cargo_{cargoId}', 'chat_{threadId}'

     ##### Background Jobs & Processing
     - **CargoExpiryJob**, **QuoteExpiryJob**, , **SearchIndexingJob**,
     **NotificationDispatchJob**

   
     #### SETTINGS PAGE (Node.js + Express + Prisma + Supabase + Socket.io)

     ##### API Endpoints Architecture
     - **General Settings Management**: GET/PUT /api/settings/general
     - **Account & Subscription Management**: GET /api/settings/account, PUT /api/settings/account/profile, POST
     /api/settings/subscription/upgrade, POST /api/settings/subscription/cancel, GET
     /api/settings/subscription/invoices
     - **Notification Preferences Management**: GET/PUT /api/settings/notifications, POST
     /api/settings/notifications/test
     - **Data & Privacy Management**: GET /api/settings/privacy, POST /api/settings/data/export, DELETE
     /api/settings/data/delete

     ##### Database Models
     - **UserSettings Model**: userId, preferences json, theme enum, privacy json, lastUpdated
     - **Subscription Model**: id, userId, plan enum, status enum, stripeCustomerId, stripeSubscriptionId,
     currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, trialEndsAt, features json, billingCycle, createdAt,
     updatedAt
     - **NotificationSettings Model**: userId, emailNotifications json, pushNotifications json, inAppNotifications
     json, devices json, emailFrequency, quietHours json, updatedAt
     - **DataExport Model**: id, userId, exportType, dataTypes json, format, status, fileUrl, fileSize, expiresAt,
     errorMessage, requestedAt, startedAt, completedAt
     - **Invoice Model**: id, subscriptionId, stripeInvoiceId, amount, currency, status, description, dueDate,
     paidAt, downloadUrl, paymentMethod, createdAt
     - **SubscriptionEvent Model**: id, subscriptionId, eventType, oldPlan, newPlan, reason, metadata json,
     createdAt

     ## PLAN DE DEZVOLTARE FLETOPIA: 0% → 100% PRODUCTION READY

     ### FAZA I: INFRASTRUCTURA DE BAZĂ (0% → 20%)

     #### Pas 1: Setup Tehnologic Fundamental (0% → 3%)
     - 1.1 Inițializează proiect Next.js 14 cu App Router (+0.5%)
     - 1.2 Configurează TypeScript cu tsconfig strict (+0.5%)
     - 1.3 Setup Tailwind CSS cu configurare customizată (+0.5%)
     - 1.4 Instalează și configurează Prisma ORM (+0.5%)
     - 1.5 Setup Supabase database connection (+0.5%)
     - 1.6 Configurează environment variables (.env.local + .env.example) (+0.5%)

     #### Pas 2: Autentificare și Management Utilizatori (3% → 8%)
     - 2.1 Integrează Clerk authentication (+1%)
     - 2.2 Creează User model în Prisma schema (+0.5%)
     - 2.3 Setup middleware Clerk pentru protecția rutelor (+0.5%)
     - 2.4 Implementează pages: /login, /register (+1%)
     - 2.5 Creează componenta SubscriptionGate pentru Trial/Pro (+1%)
     - 2.6 Setup Stripe customer creation la sign-up (+1%)

     #### Pas 3: Database Schema și Models Complete (8% → 15%)
     - 3.1 Definește Cargo model complet cu toate câmpurile (+1%)
     - 3.2 Definește Quote model cu relații (+1%)
     - 3.3 Definește Deal model pentru tranzacții (+1%)
     - 3.4 Definește ChatThread și ChatMessage models (+1%)

     - 3.7 Definește NotificationSettings și UserSettings (+0.5%)
     - 3.8 Rulează prima migrație Prisma cu toate models (+1%)

     #### Pas 3.9: CI/CD Pipeline și Quality Gates (15% → 16%)
     - 3.9 Setup CI pipeline: GitHub Actions cu pnpm, Jest, Playwright, Storybook (+1%)

     #### Pas 4: API Foundation și Middleware (16% → 21%)
     - 4.1 Setup Express server cu middleware de bază (+1%)
     - 4.2 Implementează Clerk middleware pentru API validation (+1%)
     - 4.3 Setup error handling middleware global (+1%)
     - 4.4 Implementează rate limiting cu express-rate-limit (+1%)
     - 4.5 Setup logging cu Winston sau similar (+1%)

     ### FAZA II: HOMEPAGE ȘI MARKETPLACE CORE (20% → 45%)

     #### Pas 5: Homepage Implementation (20% → 25%)
     - 5.1 Creează layout-ul homepage cu hero section (+1%)
     - 5.2 Implementează API GET /api/home-data (+1%)
     - 5.3 Adaugă Quick Actions: Post Cargo Fast, Find Loads (+1%)
     - 5.4 Implementează POST /api/cargo/quick-post (+1%)
     - 5.5 Testează flow complet: homepage → quick actions → rezultate (+1%)

     #### Pas 6: Marketplace Frontend Structure (25% → 32%)
     - 6.1 Creează layout marketplace cu header navigation (+1%)
     - 6.2 Implementează TabNavigation: ALL OFFERS | MY CARGO | MY QUOTES | ACTIVE DEALS (+1%)
     - 6.3 Creează SearchBar component cu filtering (+1%)
     - 6.4 Implementează CargoFilters: countries, types, urgency, price (+1%)
     - 6.5 Creează CargoCard component pentru grid display (+1%)
     - 6.6 Setup grid layout responsiv pentru cargo cards (+1%)
     - 6.7 Testează navigation și filtering (fără date reale încă) (+1%)
     - 6.8 Run axe-core audit și adaugă Storybook visual tests (+0.5%)

     #### Pas 7: Marketplace Backend API (32.5% → 40.5%)
     - 7.1 Implementează GET /api/marketplace/all-offers cu filtering (+2%)
     - 7.2 Implementează GET /api/marketplace/my-cargo (+1%)
     - 7.3 Implementează GET /api/marketplace/my-quotes (+1%)
     - 7.4 Implementează GET /api/marketplace/active-deals (+1%)
     - 7.5 Implementează POST /api/cargo/create complet (+2%)
     - 7.6 Testează toate endpoint-urile cu Postman/curl (+1%)

     #### Pas 8: AddCargo Modal și Functionalitate (40.5% → 45.5%)
     - 8.1 Creează AddCargoModal component cu toate câmpurile (+2%)
     - 8.2 Implementează validare frontend cu Zod (+1%)
     - 8.3 Conectează modal la API cu error handling (+1%)
     - 8.4 Testează flow complet: Add Cargo → Save → Apare în MY CARGO (+1%)

     ### FAZA III: QUOTES, CHAT ȘI DEALS (45.5% → 65.5%)

     #### Pas 9: CargoDetail Modal și Quote System (45.5% → 53.5%)
     - 9.1 Creează CargoDetailModal cu toate secțiunile (+2%)
     - 9.2 Implementează POST /api/cargo/[id]/quote (+1%)
     - 9.3 Implementează GET /api/cargo/[id]/quotes pentru owners (+1%)
     - 9.4 Adaugă Quote Management în modal cu send quote (+2%)
     - 9.5 Implementează PUT /api/quotes/[id]/accept (+1%)
     - 9.6 Testează flow: View Cargo → Send Quote → Accept Quote (+1%)

     #### Pas 10: Chat System Real-time (53.5% → 60.5%)
     - 10.1 Setup Socket.io server și client (+1%)
     - 10.2 Implementează ChatInterface component (+2%)
     - 10.3 Creează API endpoints pentru chat messages (+1%)
     - 10.4 Implementează real-time messaging cu rooms (+2%)
     - 10.5 Testează chat între două utilizatori (+1%)

     #### Pas 11: Deal Management și Progress Tracking (60.5% → 65.5%)
     - 11.1 Implementează Deal creation la quote accept (+1%)
     - 11.2 Creează DealProgress component pentru tracking (+2%)
     - 11.3 Implementează status updates pentru deals (+1%)
     - 11.4 Testează flow complet: Quote → Accept → Deal → Progress (+1%)
     - 11.5 Adaugă RLS policies în Supabase și pgcrypto encryption (+0.5%)



     ### FAZA V: SETTINGS, BILLING ȘI OPTIMIZATION (66% → 96%)

     #### Pas 15: Settings și Subscription Management (66% → 73%)
     - 15.1 Implementează Settings page structure (+1%)
     - 15.2 Creează Stripe integration complet (+2%)
     - 15.3 Implementează subscription upgrade/cancel flow (+2%)
     - 15.4 Creează NotificationSettings management (+1%)
     - 15.5 Implementează GDPR data export/deletion (+1%)
     - 15.6 Run pa11y CI și verifică GDPR export flow (+0.3%)

     #### Pas 16: Real-time Features și Notifications (73.3% → 88.3%)
     - 16.1 Setup WebSocket events pentru toate features (+2%)
     - 16.2 Implementează push notifications (+1%)
     - 16.3 Setup email notifications cu templates (+1%)
     - 16.4 Testează all real-time features (+1%)

     #### Pas 17: Performance Optimization și Caching (88.3% → 96%)
     - 17.1 Implementează Redis caching pentru API-uri (+1%)
     - 17.2 Optimizează database queries cu indexes (+1%)
     - 17.3 Setup CDN pentru static assets (+0.5%)
     - 17.4 Implementează lazy loading și code splitting (+0.5%)

     ### FAZA VI: TESTING, DEPLOY ȘI PRODUCTION (96% → 100%)

     #### Pas 18: Comprehensive Testing (96% → 98%)
     - 18.1 Unit tests pentru critical business logic (+0.5%)
     - 18.2 Integration tests pentru API endpoints (+0.5%)
     - 18.3 E2E tests pentru user flows principale (+0.5%)
     - 18.4 Load testing pentru performance (+0.5%)
     - 18.5 k6 load test: 1k concurrent WebSockets + BullMQ 5k jobs (+0.2%)

     #### Pas 19: Production Deployment (98.2% → 99.2%)
     - 19.1 Setup production database (Supabase Pro) (+0.5%)
     - 19.2 Deploy backend la Vercel/Railway (+0.5%)
     - 19.3 Deploy frontend la Vercel (+0.5%)
     - 19.4 Setup domain și SSL certificates (+0.5%)

     #### Pas 20: Monitoring și Go-Live (99.2% → 100%)
     - 20.1 Setup error monitoring (Sentry) (+0.3%)
     - 20.2 Setup performance monitoring (+0.3%)
     - 20.3 Setup uptime monitoring (+0.2%)
     - 20.4 Final production testing (+0.2%)

     ---

     ## REGULI STRUCTURA PROTEJATĂ

     ### Frontend (Protected Zone)
     - **UI Components** (Pure, Stateless)
     - **Style System** (Isolated CSS/Tailwind)
     - **Layout Logic** (Independent de backend)
     - **State Management** (Clear boundaries)
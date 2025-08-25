# Fleetopia – AGENT RULES (Contract de colaborare)

## Principii de lucru
- Control și predictibilitate: execut STRICT ce ceri, unde ceri, când ceri.
- Zero surprize: niciun efect colateral; soluții minime, reversibile.
- Transparență: explic pe scurt cauza, soluția, fișierele atinse și pașii de test.

## Workflow obligatoriu
1) Analiză (read‑only) → 2) Plan scurt → 3) Aprobarea ta → 4) Implementare
5) Commit/PR cu mesaj clar → 6) Verificare (lint/build) → 7) Raport de task

## Gate-uri de aprobare (înainte de cod)
- Orice modificare structurală (routing/layout/grupuri App Router)
- Orice setare globală (theme, globals.css, config de build)
- Orice dependență nouă sau actualizare de pachete
- Orice migrare sau schimbare de schema API/DB

## Do
- Propun fixuri MINIME, cu lista de fișiere și impactul exact.
- Ofer comenzile (nu rulez eu procese persistente: build/dev/deploy); tu le execuți.
- Fac commit-uri mici, atomice; mesaje clare (feat/fix/chore + context/task).
- Mențin UI/UX neschimbat dacă nu ceri explicit.
- Escalez imediat dacă sunt blocat (motiv, impact, opțiuni).

## Don’t (implicit interzis)
- Nu introduc dependențe noi.
- Nu activez/modific setări globale.
- Nu rearanjez routing-ul / structura layout-urilor.
- Nu fac refactorizări/mutări de fișiere „din oficiu”.
- Nu rulez servicii pe mașina ta fără să ceri (îți dau comenzile).

Cu APROBAREA explicită a Maistrului, pot executa oricare din punctele de mai sus. Voi cere aprobare înainte și voi documenta exact ce urmează să fac ("cere aprobare și o poți face").

## Stil de comunicare
- Mesaje scurte, acționabile: „ce am observat / ce fac acum / cum testezi”.
- Fără teorii inutile; doar cauza exactă și remedierea.
- În română, tehnic, concis. Link la fișiere și comenzi când e relevant.

## Git & PR
- Commit de checkpoint înaintea modificărilor majore.
- Ramuri tematice: `feat/…`, `fix/…`; PR mic, ușor de revizuit.
- Nu force‑push peste munca ta fără mandat.

## Testare & CI
- Rulez lint/typecheck local (sau îți dau comanda) înainte de raport.
- Dacă CI cade, aduc logul și repar punctual; niciodată nu „închid” warning‑uri pe tăcute.

## Preferințe operaționale
- Îți ofer comenzile de pornire/execuție; tu le rulezi local/CI.
- Nu instalez Supabase CLI prin npm global; doar metode suportate oficial când ceri.

---
Aceste reguli guvernează fiecare task: întâi plan și aprobare, apoi execuție strict conform cerinței, cu raport final clar.

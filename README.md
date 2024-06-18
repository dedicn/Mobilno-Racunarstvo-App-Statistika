# Aplikacija za vođenje 3x3 basket turnira

## Kratak opis aplikacije
Aplikacija za vođenje statistike na turnirima 3x3 basketa je mobilna aplikacija razvijena korišćenjem Angular i Ionic framework-a. 
Dizajnirana je za upravljanje i praćenje statistike na 3x3 košarkaškim turnirima. Aplikacija uključuje 2 tipa korisnika: administrator i statističar.

- **Admin korisnik**: Administratori mogu dodavati timove i igrače koji učestvuju na turniru. Takođe mogu registrovati statističare koji će unositi podatke o utakmicama.
- **Statističar korisnik**: Statističari se prijavljuju koristeći kredencijale koje su dobili od administratora, unose kod utakmice, biraju timove, biraju igrače za timove i vode kompletnu statistiku za svaku utakmicu.

## Karakteristike
- **Upravljanje Timovima**: Dodavanje, izmena i upravljanje timovima i igračima.
- **Registracija Statističara**: Registrovanje statističara koji će unositi podatke o utakmicama.
- **Statistika Utakmica**: Vođenje i upravljanje sveobuhvatnom statistikom utakmica za sve igrače.
- **Autentifikacija Korisnika**: Sigurna prijava za administratore i statističare.

## Backend
Aplikacija koristi Firebase za backend usluge, uključujući autentifikaciju, bazu podataka. Firebase olakšava upravljanje korisnicima, čuvanje podataka i sinhronizaciju u realnom vremenu.

## Uputstvo za Instalaciju

### Kloniranje Repozitorijuma
Prvo, klonirajte repozitorijum na vaš lokalni računar koristeći sledeću komandu:

```bash
https://github.com/dedicn/Mobilno-Racunarstvo-App-Statistika.git
```
Potom je potrebno da se navigirate u projekat aplikacije
```bash
cd statistics-app
```
Da bi aplikacija mogla da se pokrene neophodno je da se instalitaju svi paketi, to se radi sa sledećom komandom
```bash
npm install
```
Kad je sve instalitano aplikacije se može pokrenuti sa
```bash
ionic serve
```
Aplikacija će biti pokrenuta na url "http://localhost:8100" u okviru vašeg web pretraživača

 

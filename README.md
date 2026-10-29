# Känner du boten?

Ett chattspel i realtid där minst 2 spelare och en hemlig AI chattar med varandra under alias. När tiden är slut röstar alla på vem de tror är boten.

**Spela här:** https://whoisthebot-frontend.onrender.com

> Spelet körs på Renders gratisnivå. Backenden somnar efter 15 minuter utan några anrop, så det första anropet kan ta upp till en minut.

Det här repot innehåller **frontenden**. Backenden finns här: [WhoIsTheBot-backend](https://github.com/Kippzta/WhoIsTheBot-backend)

---                                                                                                                                                                                                                                                                                                                                                                                
## Hur man spelar

1. **Lobby** – En spelare skapar ett rum och får en rumskod. De andra går med med koden. Hosten startar spelet när minst två spelare är med.
2. **Chatt** – Alla får ett hemligt alias och en fråga att prata om. En AI är med i chatten under ett eget alias. Chatten pågår i 90 sekunder.
3. **Röstning** – Alla röstar på det alias de tror är boten. Man kan inte rösta på sig själv.
4. **Resultat** – Boten avslöjas, och man ser vem som var vem och vem som gissade rätt.

---

## Teknik

| Del | Teknik |
|---|---|
| Frontend | Angular (components, signals, reactive forms), TypeScript |
| Backend | Quarkus (Java 21), Hibernate ORM med Panache, WebSockets Next |
| Databas | PostgreSQL |
| AI | OpenAI via Quarkus LangChain4j |
| Driftsättning | Render (frontend och backend), Neon (databas) |

---

## Arkitektur

Spelet använder två sorters kommunikation:

- **REST** för att skapa och gå med i ett rum. Svaret från servern innehåller spelarens `playerId`, som sparas i `sessionStorage`.
- **WebSocket** för allt som händer i spelet. Varje spelare har en egen anslutning: `/ws/rooms/{roomCode}/{playerId}`.

Alla WebSocket-meddelanden skickas som ett *kuvert* med en typ och data. Typen säger vad meddelandet
handlar om, och datan kan vara olika saker beroende på vad typen är, till exempel en text, en lista eller
ett objekt. I backenden avänds en generisk typ för att smidigt kunna skicka det som behövs, `WebSocketMessageDTO<T>`.

```json
{ "type": "CHAT_MESSAGE", "data": "detta är en sträng t.ex." }
```

Ett annat exempel där backend skickar ett objekt som innehåller spelarens alias och vad den skrev (sträng):

```json
{ "type": "CHAT_MESSAGE", "data": { "alias": "Mulle", "text": "Fan va gött!"} }
```
**Meddelandetyper**

Här är de typer som finns för tillfället.
Typen i kuvertet avgör vad som ska hända när meddelandet tas emot.
Detta sätt gör det enkelt att bygga vidare på och tydligt med vad som ska göras med datan som skickas.

**Från frontend till backend**

| Typ | Data | Betyder |
|---|---|---|
| `START_GAME` | null | hosten startar spelet |
| `CHAT_MESSAGE` | text | en spelare skriver i chatten |
| `CHAT_TIME_END` | null | nedräkningen har nått noll |
| `VOTE` | alias | en spelare röstar |

**Från backend till frontend**

| Typ | Data | Betyder |
|---|---|---|
| `ROOM_UPDATED` | rummet | spelarlistan eller statusen har ändrats |
| `GAME_STATUS_CHANGED` | status | spelet byter fas |
| `ALIAS_ASSIGNED` | alias | ditt eget alias, skickas bara till din connection så ingen annan ser |
| `QUESTION_ASSIGNED` | text | frågan att prata om |
| `TIMER_STARTED` | sekunder | hur länge chatten håller på |
| `CHAT_MESSAGE` | alias och text | ett nytt chattmeddelande |
| `VOTING_STARTED` | lista med alias | alternativen att rösta på |
| `GAME_RESULT` | resultatet | vem som var boten, och vem som gissade rätt |

### Struktur

```
src/app/
├── components/     Lobby, Chat, Voting, Result
├── models/         DTO:er som speglar backenden
├── pages/          StartPage, RoomPage
├── services/       GameRoomService (REST), GameRoomSocketService (WebSocket), PlayerSessionService (SessionStorage)
└── types/          GameStatus, ServerMessage (typer från backend), WebSocketMessageType
```

`RoomPage` öppnar WebSocket-anslutningen på ngOnInit och visar rätt komponent beroende på spelets status. All data från backenden sparas i signaler i `GameRoomSocketService`, och komponenterna läser dem därifrån.

---

## Köra projektet lokalt

### Krav
- [Node.js](https://nodejs.org/) version 22 eller senare
- Backenden igång lokalt, se [backend-README:n](https://github.com/Kippzta/WhoIsTheBot-backend)

### Steg
1. Klona projektet från github till din IDE eller kodredigerare
2. Gå in i projketets mapp
3. Installera paket som behövs
4. Starta
```bash
1: git clone https://github.com/Kippzta/WhoIsTheBot-frontend.git
2: cd WhoIsTheBot-frontend
3: npm ci
4: npm start
```

Öppna http://localhost:4200

I utvecklingsläge pratar frontenden med backenden på `http://localhost:8080`, enligt `src/environments/environment.development.ts`.

**Testa med flera spelare (minst två spelare krävs för att starta):** öppna spelet i två flikar. Varje flik blir en egen spelare, eftersom `playerId` sparas i `sessionStorage`, som är separat per flik.

---

## Kända buggar

- Om man laddar om sidan under röstningen visas röstknapparna igen, även om man redan röstat. Backenden nekar en andra röst.
- Vid omladdning skickas inte chatthistoriken igen.
- Om en spelare aldrig röstar, till exempel stänger fliken, avslutas aldrig spelet.
- Felmeddelanden från backenden loggas bara, de visas inte för spelaren.

## Möjliga förbättringar

- Visa hur många som har röstat, i realtid.
- Tidsgräns för röstningen.
- Flera rundor, om majoriteten av spelarna röstar fel. Just nu sätts `currentRound` till 1 när spelet
  startar, och sparas på varje chattmeddelande, men den ökar aldrig.
- Kunna lämna lobbyn, och att *Host* går över till en annan spelare om den lämnar.
- Kunna gå med i ett pågående spel från startsidan.
- Bot som beter sig mer mänskligt: svarar inte på allt, väntar några sekunder innan den svarar, använder mer vardagligt språk.
- `ROOM_UPDATED` efter spelstart innehåller fortfarande användarnamn, inklusive botens. botens username borde inte skickas med efter spelet startat.
- Visa felmeddelanden från backenden för spelaren eller skapa tydliga i frontenden och använda.
- Fler tester

---

## Användning av AI

Jag har använt AI under projektet, främst som en handledare och stöd som jag
kunnat ställa frågor till medan jag kodat.

### Hur jag har använt AI

- **Förklaringar och frågor.** Jag har frågat om vissa begrepp, till exempel 
`computed`, `Optional`, Generics, StringBuilder. 
  Ställer alltid följdfrågor tills jag förstått varför något fungerar som det gör , kanske ibland för länge....
- **Planering.** AI har hjälpt mig dela upp när funktioner blivit för stora i mindre steg på ett pedagogiskt sätt så jag fortfarande får lösa sakerna själv steg för steg, till exempel chatten, timern och röstningen som jag hade minst tid och planering för, och diskutera hur den ska byggas på ett smart sätt innan jag skrivit koden.
- **Granskning och felsökning.** Jag har visat kod ibland när jag kört fast eller tänker att det kan skrivas på ett bättre sätt och fått feedback.

### Vad AI har gjort mer konkret

- **Stylingen**, Häjlpt mig med htmln när jag väl var klar med all funktionalitet. Jag gjorde först en basic html för varje sida/komponenet men sen har den fått hjälpa mig koppla ihop med stylingen, och den har gjort mer eller mindre all CSS för utseendet.
- **README Struktur**, Strukturen/Rubriker för denna README med vad som kan vara bra att ha med och inte. Samt designen med Markdown syntax.

### Hur jag har sett till att förstå kod när jag tagit hjälp

- Jag har frågat varför, inte bara hur, innan jag gått vidare.
- Bett om dokumentation/trådar att kunna läsa om med det jag håller på med eller kring förslag den kan ge.
- Jag har testat allt själv, i Postman och i webbläsaren.
- Jag har hittat flera buggar själv genom att testa, till exempel, sidomladdning (F5) buggen: Spelarna tappade alias, fråga, timer och röstknapparna när sidan laddades om.

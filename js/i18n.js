// js/i18n.js — KUBO Language System (da / en)
// Loads early so translations apply before the user sees content.

(function () {
  // ── Translation dictionary ────────────────────────────────────────────────

  const TRANS = {
    da: {
      // Navbar
      'nav.home':     'Forside',
      'nav.modules':  'Læringsmoduler',
      'nav.games':    'Spil',
      'nav.calendar': 'Visuel Kalender',
      'nav.time':     'Tidsstyring',
      'nav.contact':  'Kontakt',
      'nav.logout':   'Log ud',

      // Footer
      'footer.copy': '© 2025 KUBO — Kalender, Ur, Bog, Organisering',
      'footer.back': 'Tilbage til forsiden',
      'footer.contact': 'Kontakt os',

      // Index hero
      'index.badge':    'Kalender · Ur · Bog · Organisering',
      'index.hero.h1':  'Matematik er ikke svært —<br><span>den skal bare forklares rigtigt</span>',
      'index.hero.p':   'KUBO er en tryg læringsplatform for elever med talblindhed. Vi gør tal, tid og struktur forståelig med farver, billeder og tålmodighed.',
      'index.hero.btn1':'Start læringsmoduler',
      'index.hero.btn2':'Visuel Kalender',

      // Features
      'feat.title':       'Alt hvad du behøver',
      'feat.sub':         'KUBO samler de vigtigste redskaber for elever med talblindhed på ét sted.',
      'feat.mod.title':   'Læringsmoduler',
      'feat.mod.p':       'Interaktive øvelser i klokken, tal, geometri, brøker og meget mere — personliggør det til præcis det niveau, du er på.',
      'feat.mod.link':    'Gå til moduler →',
      'feat.games.title': 'Spil',
      'feat.games.p':     'Lær gennem leg med sjove og farverige spil, der gør matematik til en positiv oplevelse.',
      'feat.games.link':  'Se spil →',
      'feat.cal.title':   'Visuel Kalender',
      'feat.cal.p':       'En farverig kalender med symboler, der gør det nemt at holde styr på dage og opgaver.',
      'feat.cal.link':    'Åbn kalender →',
      'feat.time.title':  'Tidsstyring',
      'feat.time.p':      'Del din tid op på opgaver med lagkagediagrammer — visuelt, enkelt og effektivt til eksamen.',
      'feat.time.link':   'Prøv tidsstyring →',

      // Who section
      'who.title':         'Hvem er KUBO til?',
      'who.sub':           'KUBO er skabt til elever med talblindhed af talblinde.',
      'who.parents.title': '👨‍👩‍👧 Til forældre',
      'who.experts.title': '🧠 Til fagpersoner',

      // Callout
      'callout.quote': '"KUBO minimerer det spildte talent"',
      'callout.p':     'En platform, hvor talblindhed ikke er en barriere, men en udfordring vi møder med forståelse, struktur og varme.',

      // Login
      'login.subtitle': 'Log ind for at gemme din kalender',
      'login.tab.in':   'Log ind',
      'login.tab.reg':  'Opret konto',
      'login.user.lbl': 'Brugernavn',
      'login.pass.lbl': 'Adgangskode',
      'login.btn':      'Log ind',
      'reg.user.lbl':   'Brugernavn',
      'reg.pass.lbl':   'Adgangskode',
      'reg.pass2.lbl':  'Bekræft adgangskode',
      'reg.btn':        'Opret konto',
      'login.user.ph':  'Dit brugernavn',
      'login.pass.ph':  'Din adgangskode',
      'reg.user.ph':    'Vælg et brugernavn',
      'reg.pass.ph':    'Vælg en adgangskode',
      'reg.pass2.ph':   'Gentag adgangskode',

      // Moduler page
      'mod.h1':  '📚 Læringsmoduler',
      'mod.sub': 'Interaktive øvelser i klokken, tal, geometri, brøker og meget mere. Tag det i dit eget tempo!',

      'mod.clock.h2':    '🕒 Forstå klokken',
      'mod.clock.p':     'Et ur har to visere: en lille viser (timer) og en stor viser (minutter). Se på uret nedenfor og svar på spørgsmålet.',
      'mod.clock.q':     'Hvad viser uret?',
      'mod.clock.opt1':  'Klokken er 16:00',
      'mod.clock.opt2':  'Klokken er 16:30',
      'mod.clock.opt3':  'Klokken er 17:00',
      'mod.urpref.h3':   'Hvilken type ur foretrækker du?',
      'mod.urpref.lbl':  'Foretrækker du digitalt eller analogt ur?',
      'mod.urpref.opt0': '-- Vælg --',
      'mod.urpref.opt1': 'Digitalt ur',
      'mod.urpref.opt2': 'Analogt ur',
      'mod.urpref.opt3': 'Begge er fine',
      'mod.urpref.lbl2': 'Hvorfor?',
      'mod.sort.h3':     '🧠 Opgave: Sæt tallene i rækkefølge',
      'mod.sort.p':      'Træk tallene fra boksen og sæt dem fra mindste til største.',
      'mod.sort.hint':   'Træk tallene herned i den rigtige rækkefølge:',
      'mod.rabat.h3':    '📘 Opgave: Rabat på bøger',
      'mod.rabat.p':     'Du køber 3 bøger til 79,95 kr. stykket og får 15% rabat.',
      'mod.rabat.lbl':   'Hvad er den samlede pris med rabat? (kun tal)',
      'mod.pattern.h3':  '🔢 Opgave: Hvad er det næste tal?',
      'mod.pattern.p':   'Find mønsteret i rækken og skriv det næste tal:',
      'mod.pattern.lbl': 'Dit svar:',
      'mod.largest.h3':  '📊 Opgave: Hvilket tal er størst?',
      'mod.largest.p':   'Vælg det største tal blandt følgende:',
      'mod.round.h3':    '💡 Opgave: Rund tallet af',
      'mod.round.p':     'Hvordan runder du 4,76 til nærmeste hele tal?',
      'mod.round.lbl':   'Dit svar:',
      'mod.angle.h3':    '📐 Opgave: Tæl 90-graders vinkler',
      'mod.angle.p':     'Se på figurerne og skriv, hvor mange 90-graders vinkler der er i alt.',
      'mod.angle.lbl':   'Antal 90° vinkler:',
      'mod.floor.h3':    '🧱 Opgave: Beregn areal og pris for gulvtæppe',
      'mod.floor.p':     'Figuren viser et gulvareal. Beregn arealet i m² og prisen, hvis det koster 77 kr pr. m².',
      'mod.floor.lbl1':  '1️⃣ Areal i m²:',
      'mod.floor.lbl2':  '2️⃣ Pris i kr:',
      'mod.grid.h3':     '🧮 Opgave: Lav figur',
      'mod.grid.p':      'Klik på felterne for at lave en figur med et areal på 23.',
      'mod.okr1.h3':     '🧮 Opgave: Tæl omkredsen af figuren',
      'mod.okr1.p':      'Klik på hver kant af figuren. Hver kasse svarer til 1 meter.',
      'mod.okr1.lbl':    'Omkreds i meter:',
      'mod.okr2.h3':     '🧮 Opgave: Tæl omkredsen af figuren (svær)',
      'mod.refl.lbl':    '🧠 Refleksion: Gør det en forskel hvis gitteret rykkes?',
      'mod.plus.h3':     '➕ Opgave: Svære plusstykker',
      'mod.minus.h3':    '➖ Opgave: Svære minusstykker',
      'mod.div.h3':      '➗ Opgave: Svære divisionsstykker',
      'mod.brok.h3':     '🔢 Opgave: Omregn brøker til procenter',
      'mod.cake.h3':     '🎂 Kagekaos i kantinen',
      'mod.cake.lbl1':   'Hvor mange elever deltog?',
      'mod.cake.lbl2':   'Hvor mange slags kager blev der bagt?',
      'mod.cake.lbl3':   'Hvor mange stykker chokoladekage blev der i alt?',
      'mod.cake.lbl4':   'Hvor mange stykker lagkage blev der?',
      'mod.cake.lbl5':   'Hvor mange stykker citronmåne var tilbage?',
      'mod.dates.h3':    '📅 Opgave: Regn med datoer',
      'mod.dates.p':     'Læs historien og svar på spørgsmålene.',
      'mod.dates.lbl1':  'Hvornår kom Emma hjem? (dd-mm-yyyy)',
      'mod.dates.lbl2':  'Hvornår tog Lucas afsted? (dd-mm-yyyy)',
      'mod.dates.lbl3':  'Hvornår startede de i skole igen? (dd-mm-yyyy)',
      'mod.units.h3':    '📏 Opgave: Omregn måleenheder',
      'mod.units.p1':    '1. Omregn 3,2 meter til centimeter:',
      'mod.units.p2':    '2. Omregn 1,5 liter til deciliter:',
      'mod.units.p3':    '3. Hvor mange sekunder er der i 4 minutter og 30 sekunder?',

      // Common buttons
      'btn.check':     'Tjek svar',
      'btn.send.fb':   'Send feedback',
      'btn.send.msg':  'Send besked',
      'btn.add':       'Tilføj',
      'btn.reset':     'Nulstil til standard',

      // Feedback (used in moduler.js via window.t)
      'fb.select':      '⚠️ Vælg et svar.',
      'fb.select.type': '⚠️ Vælg en ur-type.',
      'fb.enter':       '⚠️ Indtast et tal.',
      'fb.enter.whole': '⚠️ Indtast et helt tal.',
      'fb.fill.both':   '⚠️ Udfyld begge felter med tal.',
      'fb.fill.6':      '⚠️ Du skal placere alle 6 tal.',
      'fb.write.more':  '⚠️ Skriv lidt mere – prøv at forklare med dine egne ord.',
      'fb.thanks.refl': '✅ Tak for din refleksion!',
      'fb.thanks.pref': '✅ Tak for din feedback!',
      'fb.correct':     '✅ Rigtigt!',
      'fb.wrong':       '❌ Forkert. Prøv igen.',
      'fb.clock.ok':    '✅ Rigtigt! Klokken er 16:30.',
      'fb.sort.ok':     '✅ Godt gået!',
      'fb.pattern.ok':  '✅ Rigtigt! Mønsteret er en fordobling.',
      'fb.largest.ok':  '✅ Rigtigt! 0,99 er størst.',
      'fb.round.ok':    '✅ Korrekt! 4,76 rundes op til 5.',
      'fb.angle.ok':    '✅ Rigtigt! Du har talt alle 90° vinkler.',
      'fb.floor.both':  '✅ Rigtigt! Du har både areal og pris korrekt.',
      'fb.floor.areal': '❌ Arealet er korrekt, men prisen er forkert.',
      'fb.floor.pris':  '❌ Prisen er korrekt, men arealet er forkert.',
      'fb.areal.ok':    '✅ Rigtigt! Arealet er 23.',
      'fb.areal.err':   '❌ Du har valgt {n} felter. Prøv igen.',
      'fb.omk.ok':      '✅ Rigtigt! Omkredsen er 11 meter.',
      'fb.cake.ok':     '✅ Super! Du har husket alle de vigtigste detaljer.',
      'fb.cake.err':    '❌ Noget er forkert. Prøv igen eller læs historien én gang mere.',
      'fb.dates.ok':    '✅ Rigtigt! Du har styr på datoerne.',
      'fb.dates.err':   '❌ Noget er forkert. Tjek dine beregninger og prøv igen.',
      'fb.units.m':     '✅ Rigtigt! 3,2 m = 320 cm.',
      'fb.units.l':     '✅ Rigtigt! 1,5 l = 15 dl.',
      'fb.units.s':     '✅ Rigtigt! 4 min 30 sek = 270 sek.',
      'fb.rabat.ok':    '✅ Korrekt!',

      // Calendar
      'cal.h1':          '📅 Visuel Kalender',
      'cal.sub':         'Klik på en dag for at tilføje begivenheder. Tilpas farver, symboler og udseende frit.',
      'cal.hint':        '💡 Klik på en dag for at tilføje begivenheder. De gemmes automatisk til din konto.',
      'cal.settings.btn':'⚙ Tilpas kalender',
      'cal.settings.h2': '⚙ Tilpas kalender',
      'cal.prev':        '◀ Forrige',
      'cal.next':        'Næste ▶',
      'cal.tog.numbers': 'Vis dagstal',
      'cal.tog.symbols': 'Vis symboler',
      'cal.tog.colors':  'Vis baggrundsfarver',
      'cal.colors.h3':   'Baggrundsfarver',
      'cal.colors.hint': '(7 farver, der gentages)',
      'cal.symbols.h3':  'Symboler',
      'cal.sym.hint':    '(emoji eller tekst, gentages)',
      'cal.reset':       'Nulstil til standard',
      'cal.event.add.btn':'Tilføj',

      // Games
      'games.h1':         '🎮 Spil og aktiviteter',
      'games.sub':        'Leg dig til læring med sjove og farverige spil, der gør matematik til en oplevelse.',
      'games.sud.h2':     '🔢 Sudoku',
      'games.sud.p':      'Udfyld gitteret så hvert tal fra 1–9 optræder præcis én gang i hver række, kolonne og 3×3-boks. De grå felter er forudfyldte.',
      'games.sud.easy':   'Nyt spil (Let)',
      'games.sud.med':    'Nyt spil (Middel)',
      'games.sud.check':  'Tjek svar',
      'games.sud.solve':  'Vis løsning',
      'games.coming.h2':  'Flere spil er på vej',
      'games.coming.p':   'Vi arbejder på flere sjove og lærerige spil til dig.',
      'games.soon':       'Kommer snart',

      // Contact
      'contact.h1':         '✉️ Kontakt os',
      'contact.sub':        'Har du spørgsmål, feedback eller ønsker du at samarbejde med KUBO? Vi hører gerne fra dig!',
      'contact.form.h2':    'Send os en besked',
      'contact.name.lbl':   'Navn',
      'contact.email.lbl':  'Email',
      'contact.msg.lbl':    'Besked',
      'contact.btn':        'Send besked',
      'contact.info.h3':    'Om KUBO',
      'contact.info.p':     'KUBO er en læringsplatform skabt til elever med talblindhed (dyscalculia). Vi tror på, at alle kan lære matematik — det handler bare om at finde den rigtige tilgang.',
      'contact.miss.title': 'Vores mission',
      'contact.miss.p':     'At minimere det spildte talent ved at gøre matematik tilgængeligt for alle.',
      'contact.mod.title':  'Læringsmoduler',
      'contact.mod.p':      'Interaktive øvelser tilpasset elever med talblindhed.',
      'contact.fb.title':   'Feedback er velkomment',
      'contact.fb.p':       'Har du ideer til nye øvelser eller spil? Vi vil meget gerne høre dem!',
      'contact.quote':      '"KUBO minimerer det spildte talent"',

      // Time management
      'time.h1':  '⏳ Tidsstyring',
      'time.sub': 'Fordel din tid på opgaver visuelt — med farverige lagkagediagrammer der tæller ned i realtid.',
      'time.card.h2':  '⏳ Planlæg din tid',
      'time.card.p':   'Fordel din tid på opgaver ved lige fordeling eller procentbaseret vægt. Perfekt til eksamen!',
      'time.lbl.total':'Total tid (min):',

      // Teacher (laerer)
      'laerer.gate.p':   'Læreroversigt — kun for lærere',
      'laerer.gate.btn': 'Vis oversigt',
      'laerer.title':    'Læreroversigt',
      'laerer.logout':   'Log ud',
    },

    en: {
      // Navbar
      'nav.home':     'Home',
      'nav.modules':  'Learning Modules',
      'nav.games':    'Games',
      'nav.calendar': 'Visual Calendar',
      'nav.time':     'Time Management',
      'nav.contact':  'Contact',
      'nav.logout':   'Log out',

      // Footer
      'footer.copy':    '© 2025 KUBO — Calendar, Clock, Book, Organizer',
      'footer.back':    'Back to front page',
      'footer.contact': 'Contact us',

      // Index hero
      'index.badge':    'Calendar · Clock · Book · Organizer',
      'index.hero.h1':  'Mathematics isn\'t hard —<br><span>it just needs to be explained right</span>',
      'index.hero.p':   'KUBO is a safe learning platform for students with dyscalculia. We make numbers, time and structure understandable through colours, images and patience.',
      'index.hero.btn1':'Start learning modules',
      'index.hero.btn2':'Visual Calendar',

      // Features
      'feat.title':       'Everything you need',
      'feat.sub':         'KUBO gathers the most important tools for students with dyscalculia in one place.',
      'feat.mod.title':   'Learning Modules',
      'feat.mod.p':       'Interactive exercises in clocks, numbers, geometry, fractions and much more — personalise it to exactly your level.',
      'feat.mod.link':    'Go to modules →',
      'feat.games.title': 'Games',
      'feat.games.p':     'Learn through play with fun and colourful games that make mathematics a positive experience.',
      'feat.games.link':  'See games →',
      'feat.cal.title':   'Visual Calendar',
      'feat.cal.p':       'A colourful calendar with symbols that makes it easy to keep track of days and tasks.',
      'feat.cal.link':    'Open calendar →',
      'feat.time.title':  'Time Management',
      'feat.time.p':      'Divide your time on tasks with pie charts — visual, simple and effective for exams.',
      'feat.time.link':   'Try time management →',

      // Who section
      'who.title':         'Who is KUBO for?',
      'who.sub':           'KUBO is created for students with dyscalculia by people with dyscalculia.',
      'who.parents.title': '👨‍👩‍👧 For parents',
      'who.experts.title': '🧠 For professionals',

      // Callout
      'callout.quote': '"KUBO minimises wasted talent"',
      'callout.p':     'A platform where dyscalculia is not a barrier, but a challenge we meet with understanding, structure and warmth.',

      // Login
      'login.subtitle': 'Log in to save your calendar',
      'login.tab.in':   'Log in',
      'login.tab.reg':  'Create account',
      'login.user.lbl': 'Username',
      'login.pass.lbl': 'Password',
      'login.btn':      'Log in',
      'reg.user.lbl':   'Username',
      'reg.pass.lbl':   'Password',
      'reg.pass2.lbl':  'Confirm password',
      'reg.btn':        'Create account',
      'login.user.ph':  'Your username',
      'login.pass.ph':  'Your password',
      'reg.user.ph':    'Choose a username',
      'reg.pass.ph':    'Choose a password',
      'reg.pass2.ph':   'Repeat password',

      // Moduler page
      'mod.h1':  '📚 Learning Modules',
      'mod.sub': 'Interactive exercises in clocks, numbers, geometry, fractions and much more. Take it at your own pace!',

      'mod.clock.h2':    '🕒 Understanding the clock',
      'mod.clock.p':     'A clock has two hands: a small hand (hours) and a large hand (minutes). Look at the clock below and answer the question.',
      'mod.clock.q':     'What time does the clock show?',
      'mod.clock.opt1':  'The time is 16:00',
      'mod.clock.opt2':  'The time is 16:30',
      'mod.clock.opt3':  'The time is 17:00',
      'mod.urpref.h3':   'Which type of clock do you prefer?',
      'mod.urpref.lbl':  'Do you prefer a digital or analogue clock?',
      'mod.urpref.opt0': '-- Select --',
      'mod.urpref.opt1': 'Digital clock',
      'mod.urpref.opt2': 'Analogue clock',
      'mod.urpref.opt3': 'Both are fine',
      'mod.urpref.lbl2': 'Why?',
      'mod.sort.h3':     '🧠 Task: Put the numbers in order',
      'mod.sort.p':      'Drag the numbers from the box and arrange them from smallest to largest.',
      'mod.sort.hint':   'Drag the numbers here in the correct order:',
      'mod.rabat.h3':    '📘 Task: Discount on books',
      'mod.rabat.p':     'You buy 3 books at 79.95 kr. each and get a 15% discount.',
      'mod.rabat.lbl':   'What is the total price with discount? (numbers only)',
      'mod.pattern.h3':  '🔢 Task: What is the next number?',
      'mod.pattern.p':   'Find the pattern in the sequence and write the next number:',
      'mod.pattern.lbl': 'Your answer:',
      'mod.largest.h3':  '📊 Task: Which number is largest?',
      'mod.largest.p':   'Select the largest number from the following:',
      'mod.round.h3':    '💡 Task: Round the number',
      'mod.round.p':     'How do you round 4.76 to the nearest whole number?',
      'mod.round.lbl':   'Your answer:',
      'mod.angle.h3':    '📐 Task: Count 90-degree angles',
      'mod.angle.p':     'Look at the figures and write how many 90-degree angles there are in total.',
      'mod.angle.lbl':   'Number of 90° angles:',
      'mod.floor.h3':    '🧱 Task: Calculate area and price for carpet',
      'mod.floor.p':     'The figure shows a floor area. Calculate the area in m² and the price if it costs 77 kr per m².',
      'mod.floor.lbl1':  '1️⃣ Area in m²:',
      'mod.floor.lbl2':  '2️⃣ Price in kr:',
      'mod.grid.h3':     '🧮 Task: Create figure',
      'mod.grid.p':      'Click on the cells to create a figure with an area of 23.',
      'mod.okr1.h3':     '🧮 Task: Count the perimeter',
      'mod.okr1.p':      'Click on each edge. Each square equals 1 metre.',
      'mod.okr1.lbl':    'Perimeter in metres:',
      'mod.okr2.h3':     '🧮 Task: Count the perimeter (hard)',
      'mod.refl.lbl':    '🧠 Reflection: Does it make a difference if the grid is moved?',
      'mod.plus.h3':     '➕ Task: Difficult additions',
      'mod.minus.h3':    '➖ Task: Difficult subtractions',
      'mod.div.h3':      '➗ Task: Difficult divisions',
      'mod.brok.h3':     '🔢 Task: Convert fractions to percentages',
      'mod.cake.h3':     '🎂 Cake chaos in the canteen',
      'mod.cake.lbl1':   'How many students participated?',
      'mod.cake.lbl2':   'How many types of cake were baked?',
      'mod.cake.lbl3':   'How many pieces of chocolate cake were there in total?',
      'mod.cake.lbl4':   'How many pieces of layer cake were there?',
      'mod.cake.lbl5':   'How many pieces of lemon tart were left?',
      'mod.dates.h3':    '📅 Task: Calculate with dates',
      'mod.dates.p':     'Read the story and answer the questions.',
      'mod.dates.lbl1':  'When did Emma come home? (dd-mm-yyyy)',
      'mod.dates.lbl2':  'When did Lucas leave? (dd-mm-yyyy)',
      'mod.dates.lbl3':  'When did they start school again? (dd-mm-yyyy)',
      'mod.units.h3':    '📏 Task: Convert units',
      'mod.units.p1':    '1. Convert 3.2 metres to centimetres:',
      'mod.units.p2':    '2. Convert 1.5 litres to decilitres:',
      'mod.units.p3':    '3. How many seconds are in 4 minutes and 30 seconds?',

      // Common buttons
      'btn.check':    'Check answer',
      'btn.send.fb':  'Send feedback',
      'btn.send.msg': 'Send message',
      'btn.add':      'Add',
      'btn.reset':    'Reset to default',

      // Feedback
      'fb.select':      '⚠️ Please select an answer.',
      'fb.select.type': '⚠️ Please select a clock type.',
      'fb.enter':       '⚠️ Please enter a number.',
      'fb.enter.whole': '⚠️ Please enter a whole number.',
      'fb.fill.both':   '⚠️ Fill in both fields with numbers.',
      'fb.fill.6':      '⚠️ You must place all 6 numbers.',
      'fb.write.more':  '⚠️ Write a bit more — try to explain in your own words.',
      'fb.thanks.refl': '✅ Thank you for your reflection!',
      'fb.thanks.pref': '✅ Thank you for your feedback!',
      'fb.correct':     '✅ Correct!',
      'fb.wrong':       '❌ Wrong. Try again.',
      'fb.clock.ok':    '✅ Correct! The time is 16:30.',
      'fb.sort.ok':     '✅ Well done!',
      'fb.pattern.ok':  '✅ Correct! The pattern is doubling.',
      'fb.largest.ok':  '✅ Correct! 0.99 is the largest.',
      'fb.round.ok':    '✅ Correct! 4.76 rounds up to 5.',
      'fb.angle.ok':    '✅ Correct! You counted all 90° angles.',
      'fb.floor.both':  '✅ Correct! Both area and price are right.',
      'fb.floor.areal': '❌ The area is correct, but the price is wrong.',
      'fb.floor.pris':  '❌ The price is correct, but the area is wrong.',
      'fb.areal.ok':    '✅ Correct! The area is 23.',
      'fb.areal.err':   '❌ You selected {n} cells. Try again.',
      'fb.omk.ok':      '✅ Correct! The perimeter is 11 metres.',
      'fb.cake.ok':     '✅ Great! You remembered all the key details.',
      'fb.cake.err':    '❌ Something is wrong. Try again or read the story one more time.',
      'fb.dates.ok':    '✅ Correct! You know your dates.',
      'fb.dates.err':   '❌ Something is wrong. Check your calculations and try again.',
      'fb.units.m':     '✅ Correct! 3.2 m = 320 cm.',
      'fb.units.l':     '✅ Correct! 1.5 l = 15 dl.',
      'fb.units.s':     '✅ Correct! 4 min 30 sec = 270 sec.',
      'fb.rabat.ok':    '✅ Correct!',

      // Calendar
      'cal.h1':           '📅 Visual Calendar',
      'cal.sub':          'Click on a day to add events. Customise colours, symbols and appearance freely.',
      'cal.hint':         '💡 Click on a day to add events. They are saved automatically to your account.',
      'cal.settings.btn': '⚙ Customise calendar',
      'cal.settings.h2':  '⚙ Customise calendar',
      'cal.prev':         '◀ Previous',
      'cal.next':         'Next ▶',
      'cal.tog.numbers':  'Show day numbers',
      'cal.tog.symbols':  'Show symbols',
      'cal.tog.colors':   'Show background colours',
      'cal.colors.h3':    'Background colours',
      'cal.colors.hint':  '(7 colours, repeating)',
      'cal.symbols.h3':   'Symbols',
      'cal.sym.hint':     '(emoji or text, repeating)',
      'cal.reset':        'Reset to default',
      'cal.event.add.btn':'Add',

      // Games
      'games.h1':        '🎮 Games and activities',
      'games.sub':       'Learn through play with fun and colourful games that make mathematics an experience.',
      'games.sud.h2':    '🔢 Sudoku',
      'games.sud.p':     'Fill in the grid so each number 1–9 appears exactly once in each row, column and 3×3 box. Grey cells are pre-filled.',
      'games.sud.easy':  'New game (Easy)',
      'games.sud.med':   'New game (Medium)',
      'games.sud.check': 'Check answer',
      'games.sud.solve': 'Show solution',
      'games.coming.h2': 'More games coming soon',
      'games.coming.p':  'We are working on more fun and educational games for you.',
      'games.soon':      'Coming soon',

      // Contact
      'contact.h1':         '✉️ Contact us',
      'contact.sub':        'Do you have questions, feedback or would you like to collaborate with KUBO? We\'d love to hear from you!',
      'contact.form.h2':    'Send us a message',
      'contact.name.lbl':   'Name',
      'contact.email.lbl':  'Email',
      'contact.msg.lbl':    'Message',
      'contact.btn':        'Send message',
      'contact.info.h3':    'About KUBO',
      'contact.info.p':     'KUBO is a learning platform created for students with dyscalculia. We believe everyone can learn mathematics — it\'s just about finding the right approach.',
      'contact.miss.title': 'Our mission',
      'contact.miss.p':     'To minimise wasted talent by making mathematics accessible to everyone.',
      'contact.mod.title':  'Learning Modules',
      'contact.mod.p':      'Interactive exercises adapted for students with dyscalculia.',
      'contact.fb.title':   'Feedback is welcome',
      'contact.fb.p':       'Do you have ideas for new exercises or games? We\'d love to hear them!',
      'contact.quote':      '"KUBO minimises wasted talent"',

      // Time management
      'time.h1':       '⏳ Time Management',
      'time.sub':      'Distribute your time on tasks visually — with colourful pie charts counting down in real time.',
      'time.card.h2':  '⏳ Plan your time',
      'time.card.p':   'Distribute your time on tasks with equal distribution or percentage-based weight. Perfect for exams!',
      'time.lbl.total':'Total time (min):',

      // Teacher
      'laerer.gate.p':   'Teacher overview — for teachers only',
      'laerer.gate.btn': 'Show overview',
      'laerer.title':    'Teacher overview',
      'laerer.logout':   'Log out',
    }
  };

  // ── Public helpers ────────────────────────────────────────────────────────

  // Check sessionStorage first: doLogin() stores the Firebase language pref there.
  // Fall back to localStorage (persisted across sessions), then default to Danish.
  let _lang = sessionStorage.getItem('kubo_lang') || localStorage.getItem('kubo_lang') || 'da';

  window.t = function (key, vars) {
    const str = (TRANS[_lang] && TRANS[_lang][key]) ||
                (TRANS.da && TRANS.da[key]) || key;
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : '{' + k + '}'));
  };

  window.getCurrentLang = function () { return _lang; };

  // ── Apply translations ────────────────────────────────────────────────────

  function applyLang(lang) {
    _lang = lang;
    localStorage.setItem('kubo_lang', lang);
    sessionStorage.setItem('kubo_lang', lang);
    document.documentElement.lang = lang;

    const tr = TRANS[lang] || TRANS.da;

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = tr[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = tr[el.dataset.i18nHtml];
      if (v !== undefined) el.innerHTML = v;
    });
    // data-i18n-ph → placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = tr[el.dataset.i18nPh];
      if (v !== undefined) el.placeholder = v;
    });

    // Auto-translate navbar links by their known text
    const allTexts = {};
    ['da', 'en'].forEach(l => {
      Object.entries(TRANS[l]).forEach(([k, v]) => {
        if (typeof v === 'string' && !v.includes('<')) allTexts[v.trim()] = k;
      });
    });
    document.querySelectorAll('.navbar-nav a').forEach(a => {
      const key = allTexts[a.textContent.trim()];
      if (key && tr[key]) a.textContent = tr[key];
    });
    // Logout button (has onclick="doLogout()")
    document.querySelectorAll('button[onclick="doLogout()"]').forEach(b => {
      if (tr['nav.logout']) b.textContent = tr['nav.logout'];
    });
    // Footer copyright paragraph
    document.querySelectorAll('footer p').forEach(p => {
      if (p.textContent.trim().startsWith('©') && tr['footer.copy']) {
        p.innerHTML = tr['footer.copy']
          .replace('KUBO', '<strong>KUBO</strong>');
      }
    });
    // Footer links
    document.querySelectorAll('footer a').forEach(a => {
      const key = allTexts[a.textContent.trim()];
      if (key && tr[key]) a.textContent = tr[key];
    });

    // Update toggle button label
    const toggle = document.getElementById('langToggleBtn');
    if (toggle) toggle.textContent = lang === 'da' ? '🇬🇧 EN' : '🇩🇰 DA';
  }

  window.applyLang = applyLang;
  window.switchLang = function () {
    const newLang = _lang === 'da' ? 'en' : 'da';
    applyLang(newLang);
    // Persist the choice to Firebase if the student is logged in
    if (typeof savePreferredLanguage === 'function') {
      savePreferredLanguage(newLang);
    }
  };

  // ── Inject language toggle into navbar ────────────────────────────────────

  function injectToggle() {
    if (document.getElementById('langToggleBtn')) return;

    // Works for both the standard navbar and the teacher navbar
    const target = document.querySelector('.navbar-inner') ||
                   document.querySelector('.teacher-nav .right');
    if (!target) return;

    const btn = document.createElement('button');
    btn.id = 'langToggleBtn';
    btn.onclick = window.switchLang;
    btn.style.cssText =
      'padding:0.25rem 0.7rem;font-size:0.82rem;font-family:inherit;font-weight:700;' +
      'border:2px solid #4f46e5;border-radius:8px;background:transparent;' +
      'color:#4f46e5;cursor:pointer;transition:all 0.2s;min-width:64px;margin-left:0.5rem;';
    btn.onmouseover = () => { btn.style.background = '#4f46e5'; btn.style.color = '#fff'; };
    btn.onmouseout  = () => { btn.style.background = 'transparent'; btn.style.color = '#4f46e5'; };
    btn.textContent = _lang === 'da' ? '🇬🇧 EN' : '🇩🇰 DA';
    target.appendChild(btn);
  }

  // ── Language picker popup ─────────────────────────────────────────────────

  function showPicker() {
    const overlay = document.createElement('div');
    overlay.id = 'kuboLangPicker';
    overlay.style.cssText =
      'position:fixed;inset:0;background:linear-gradient(135deg,#FFF7ED 0%,#EEF2FF 100%);' +
      'display:flex;align-items:center;justify-content:center;z-index:99999;' +
      'font-family:"Nunito",sans-serif;';

    overlay.innerHTML = `
      <div style="background:#fff;border-radius:24px;box-shadow:0 12px 48px rgba(0,0,0,0.14);
                  padding:3rem 2.5rem;width:100%;max-width:420px;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#f97316;margin-bottom:0.25rem;">
          KU<span style="color:#4f46e5;">BO</span>
        </div>
        <h2 style="font-size:1.4rem;font-weight:700;margin:0.75rem 0 0.35rem;color:#1e293b;">
          Vælg sprog · Choose language
        </h2>
        <p style="color:#64748b;font-size:0.9rem;margin-bottom:2rem;">
          Du kan altid skifte igen · You can always change later
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <button id="_pickDA" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;
            padding:1.4rem 1.75rem;border-radius:16px;border:2px solid #e2e8f0;background:#fff;
            cursor:pointer;font-family:inherit;min-width:130px;transition:all 0.18s;">
            <span style="font-size:2.4rem;">🇩🇰</span>
            <span style="font-weight:700;font-size:1.05rem;color:#1e293b;">Dansk</span>
          </button>
          <button id="_pickEN" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;
            padding:1.4rem 1.75rem;border-radius:16px;border:2px solid #e2e8f0;background:#fff;
            cursor:pointer;font-family:inherit;min-width:130px;transition:all 0.18s;">
            <span style="font-size:2.4rem;">🇬🇧</span>
            <span style="font-weight:700;font-size:1.05rem;color:#1e293b;">English</span>
          </button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const styleHover = (btn, borderColor, bgColor) => {
      btn.onmouseover = () => { btn.style.borderColor = borderColor; btn.style.background = bgColor; };
      btn.onmouseout  = () => { btn.style.borderColor = '#e2e8f0'; btn.style.background = '#fff'; };
    };
    const da = document.getElementById('_pickDA');
    const en = document.getElementById('_pickEN');
    styleHover(da, '#f97316', '#fff7ed');
    styleHover(en, '#4f46e5', '#eef2ff');

    da.onclick = () => { overlay.remove(); applyLang('da'); };
    en.onclick = () => { overlay.remove(); applyLang('en'); };
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  function boot() {
    injectToggle();
    if (!localStorage.getItem('kubo_lang')) {
      showPicker();
    } else {
      applyLang(_lang);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

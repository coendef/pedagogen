'use client'

import { useState, useRef } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

// Bekende pedagogen met hun achtergrond - uitgebreid met nieuwe pedagogen
const PEDAGOGEN = [
  {
    id: 'steiner',
    naam: 'Rudolf Steiner',
    periode: '1861-1925',
    land: 'Oostenrijk',
    beweging: 'Waldorfpedagogiek',
    avatar: '🌱',
    kleur: 'green',
    beschrijving: 'Grondlegger van de Waldorfpedagogiek en antroposofie',
    kernprincipes: [
      'Ontwikkeling in fasen (7-jarige cycli)',
      'Hoofd, hart en handen',
      'Vrijheid in denken',
      'Artistieke vorming',
      'Spirituele ontwikkeling'
    ],
    context: `Je bent Rudolf Steiner, de grondlegger van de Waldorfpedagogiek en antroposofie. 
    Je gelooft in de ontwikkeling van het kind in drie fasen van 7 jaar, waarbij je de nadruk legt op:
    - 0-7 jaar: Imitatie en spel, bescherming van de zintuigen
    - 7-14 jaar: Autoriteit en artistieke vorming, ontwikkeling van gevoel
    - 14-21 jaar: Kritisch denken en vrijheid, ontwikkeling van het denken
    
    Je benadrukt het belang van:
    - Natuurlijke materialen en omgeving
    - Artistieke activiteiten (euritmie, muziek, tekenen)
    - Praktische vaardigheden (handwerk, tuinieren)
    - Spirituele ontwikkeling en antroposofische inzichten
    - Respect voor de individualiteit van elk kind
    
    Antwoord vanuit je antroposofische wereldbeeld en je ervaring als pedagoog, filosoof en spiritueel denker.`
  },
  {
    id: 'montessori',
    naam: 'Maria Montessori',
    periode: '1870-1952',
    land: 'Italië',
    beweging: 'Montessoripedagogiek',
    avatar: '🌸',
    kleur: 'pink',
    beschrijving: 'Eerste vrouwelijke arts in Italië en grondlegger van de Montessorimethode',
    kernprincipes: [
      'Het kind als eigen persoon',
      'Voorbereide omgeving',
      'Zelfstandig leren',
      'Gevoelige perioden',
      'Vrijheid binnen grenzen'
    ],
    context: `Je bent Maria Montessori, arts, pedagoog en de eerste vrouwelijke arts in Italië. 
    Je ontwikkelde de Montessorimethode gebaseerd op wetenschappelijke observatie van kinderen.
    
    Je kernprincipes zijn:
    - Het kind heeft een natuurlijke drang tot leren
    - Voorbereide omgeving met specifiek materiaal
    - Vrijheid van beweging en keuze binnen structuur
    - Gevoelige perioden waarin kinderen bepaalde vaardigheden gemakkelijk oppikken
    - De rol van de volwassene als observator en begeleider, niet als instructeur
    - Respect voor het natuurlijke ontwikkelingsproces
    
    Je materialen zijn zelfcorrigerend en bevorderen:
    - Praktisch leven (dagelijkse vaardigheden)
    - Zintuiglijke ontwikkeling
    - Taal en communicatie
    - Wiskunde en logica
    - Kosmische opvoeding (begrip van de wereld)
    
    Antwoord vanuit je wetenschappelijke achtergrond en je revolutionaire visie op kinderen als competente individuen.`
  },
  {
    id: 'parkhurst',
    naam: 'Helen Parkhurst',
    periode: '1887-1973',
    land: 'Verenigde Staten',
    beweging: 'Daltonplan',
    avatar: '🎯',
    kleur: 'blue',
    beschrijving: 'Ontwikkelaar van het Daltonplan voor individueel leren',
    kernprincipes: [
      'Individueel leren',
      'Eigen tempo',
      'Verantwoordelijkheid',
      'Samenwerking',
      'Praktijkgericht onderwijs'
    ],
    context: `Je bent Helen Parkhurst, Amerikaanse pedagoog en grondlegger van het Daltonplan.
    Je ontwikkelde dit systeem om individueel leren en verantwoordelijkheid te bevorderen.
    
    De kernprincipes van het Daltonplan zijn:
    - Vrijheid: Leerlingen kiezen hun eigen tempo en volgorde
    - Samenwerking: Leren van en met elkaar
    - Verantwoordelijkheid: Leerlingen zijn verantwoordelijk voor hun eigen leerproces
    
    Je systeem kenmerkt zich door:
    - Contracten/opdrachten in plaats van klassikale lessen
    - Laboratoria/werkruimtes per vak
    - Leerlingen bewegen vrij tussen ruimtes
    - Docenten als adviseurs en begeleiders
    - Zelfstandig plannen en evalueren
    
    Je gelooft dat kinderen het beste leren wanneer ze:
    - Eigen keuzes kunnen maken
    - Verantwoordelijkheid dragen voor hun leren
    - In hun eigen tempo kunnen werken
    - Praktische ervaring opdoen
    
    Antwoord vanuit je Amerikaanse pragmatische benadering en je focus op individuele vrijheid en verantwoordelijkheid.`
  },
  {
    id: 'freinet',
    naam: 'Célestin Freinet',
    periode: '1896-1966',
    land: 'Frankrijk',
    beweging: 'Freinetpedagogiek',
    avatar: '✍️',
    kleur: 'purple',
    beschrijving: 'Franse pedagoog die de schooldrukkerij en vrije teksten introduceerde',
    kernprincipes: [
      'Vrije expressie',
      'Democratische school',
      'Praktisch werk',
      'Communicatie',
      'Sociale betrokkenheid'
    ],
    context: `Je bent Célestin Freinet, Franse onderwijzer en pedagoog die de Freinetpedagogiek ontwikkelde.
    Als voormalig soldaat in de Eerste Wereldoorlog ben je gewond geraakt en zoekt naar nieuwe onderwijsmethoden.
    
    Je pedagogische principes zijn:
    - Vrije expressie: Kinderen schrijven vrije teksten over hun eigen ervaringen
    - Democratische participatie: Kinderen hebben inspraak in de schoolorganisatie
    - Praktisch en betekenisvol werk: Leren door doen en maken
    - Communicatie: Schoolkrant, correspondentie met andere scholen
    - Sociale betrokkenheid: School als onderdeel van de gemeenschap
    
    Je technieken omvatten:
    - Schooldrukkerij voor het maken van teksten en kranten
    - Vrije teksten als basis voor taal- en spellingonderwijs
    - Klassenraad voor democratische besluitvorming
    - Werkplannen en zelfstandig werken
    - Contact met de buitenwereld
    
    Je gelooft in:
    - Het kind als actieve producent van kennis
    - Onderwijs dat aansluit bij de leefwereld van het kind
    - Democratische waarden en sociale rechtvaardigheid
    - Samenwerking tussen school en gemeenschap
    
    Antwoord vanuit je Franse socialistische achtergrond en je ervaring als praktijkonderwijzer.`
  },
  {
    id: 'dewey',
    naam: 'John Dewey',
    periode: '1859-1952',
    land: 'Verenigde Staten',
    beweging: 'Progressief onderwijs',
    avatar: '🔬',
    kleur: 'indigo',
    beschrijving: 'Filosoof en pedagoog, grondlegger van het progressieve onderwijs',
    kernprincipes: [
      'Learning by doing',
      'Democratische educatie',
      'Ervaring als basis',
      'Probleemoplossend denken',
      'School als gemeenschap'
    ],
    context: `Je bent John Dewey, Amerikaanse filosoof, psycholoog en pedagoog. 
    Je bent een van de grondleggers van het pragmatisme en het progressieve onderwijs.
    
    Je filosofie is gebaseerd op:
    - Pragmatisme: Kennis wordt getest door praktische toepassing
    - Democratie: Onderwijs moet democratische burgers vormen
    - Ervaring: Leren gebeurt door directe ervaring en reflectie
    - Continuïteit: Elke ervaring bouwt voort op vorige ervaringen
    
    Je onderwijsprincipes zijn:
    - Learning by doing: Actief leren door praktische activiteiten
    - Probleemoplossend denken: Wetenschappelijke methode toepassen
    - School als embryonale gemeenschap: Voorbereiding op democratisch leven
    - Integratie van vakken: Holistische benadering van kennis
    - Respect voor de individualiteit van het kind
    
    Je gelooft dat onderwijs moet:
    - Aansluiten bij de natuurlijke nieuwsgierigheid van kinderen
    - Praktische problemen uit het echte leven behandelen
    - Democratische vaardigheden ontwikkelen
    - Kritisch denken bevorderen
    - Sociale verantwoordelijkheid kweken
    
    Antwoord vanuit je pragmatische filosofie en je visie op democratische educatie.`
  },
  {
    id: 'freire',
    naam: 'Paulo Freire',
    periode: '1921-1997',
    land: 'Brazilië',
    beweging: 'Kritische pedagogiek',
    avatar: '✊',
    kleur: 'red',
    beschrijving: 'Braziliaanse pedagoog en grondlegger van de kritische pedagogiek',
    kernprincipes: [
      'Kritisch bewustzijn',
      'Bevrijdend onderwijs',
      'Dialoog',
      'Praxis',
      'Sociale rechtvaardigheid'
    ],
    context: `Je bent Paulo Freire, Braziliaanse pedagoog en grondlegger van de kritische pedagogiek.
    Je werkte met analfabeten in de favela's en ontwikkelde een revolutionaire onderwijsmethode.
    
    Je kernconcepten zijn:
    - Bankiersonderwijs vs. Bevrijdend onderwijs: Tegen passieve kennisoverdracht
    - Kritisch bewustzijn (conscientização): Bewustwording van sociale realiteit
    - Dialoog: Gelijkwaardige uitwisseling tussen leraar en leerling
    - Praxis: Combinatie van reflectie en actie voor sociale verandering
    - Culturele invasie vs. Culturele synthese: Respect voor lokale cultuur
    
    Je methode kenmerkt zich door:
    - Generatieve woorden uit de leefwereld van leerlingen
    - Probleemstellende educatie in plaats van probleemoplossende
    - Leraar-leerling en leerling-leraar relaties
    - Politieke dimensie van onderwijs erkennen
    - Onderwijs als praktijk van vrijheid
    
    Je gelooft dat onderwijs:
    - Nooit neutraal is, maar altijd politiek
    - Mensen moet helpen hun wereld kritisch te lezen
    - Onderdrukking moet blootleggen en bestrijden
    - Democratische participatie moet bevorderen
    - Sociale transformatie moet stimuleren
    
    Antwoord vanuit je Latijns-Amerikaanse context en je passie voor sociale rechtvaardigheid.`
  },
  {
    id: 'vygotsky',
    naam: 'Lev Vygotsky',
    periode: '1896-1934',
    land: 'Sovjet-Unie',
    beweging: 'Sociaal-culturele theorie',
    avatar: '🧠',
    kleur: 'teal',
    beschrijving: 'Russische psycholoog en grondlegger van de sociaal-culturele theorie',
    kernprincipes: [
      'Zone van naaste ontwikkeling',
      'Sociaal leren',
      'Culturele mediatie',
      'Taal en denken',
      'Scaffolding'
    ],
    context: `Je bent Lev Vygotsky, Russische psycholoog en pedagoog die de sociaal-culturele theorie ontwikkelde.
    Ondanks je korte leven heb je revolutionaire inzichten gegeven over leren en ontwikkeling.
    
    Je kerntheorieën zijn:
    - Zone van Naaste Ontwikkeling (ZNO): Het verschil tussen wat een kind alleen kan en met hulp
    - Sociaal leren: Ontwikkeling vindt plaats door sociale interactie
    - Culturele mediatie: Cultuur en taal vormen het denken
    - Internalisatie: Sociale processen worden individuele mentale processen
    - Scaffolding: Tijdelijke ondersteuning die geleidelijk wordt weggenomen
    
    Je inzichten over taal en denken:
    - Taal is het belangrijkste culturele instrument
    - Denken en taal ontwikkelen zich eerst apart, dan samen
    - Innerlijke spraak ontstaat uit sociale spraak
    - Taal medieert tussen individu en cultuur
    
    Je visie op onderwijs:
    - Leren gaat vooraf aan ontwikkeling
    - Samenwerking is essentieel voor leren
    - De rol van meer ervaren anderen (peers, volwassenen)
    - Culturele context bepaalt wat en hoe geleerd wordt
    - Spel als belangrijke leeractiviteit voor jonge kinderen
    
    Antwoord vanuit je Marxistische achtergrond en je focus op de sociale natuur van menselijke ontwikkeling.`
  },
  {
    id: 'piaget',
    naam: 'Jean Piaget',
    periode: '1896-1980',
    land: 'Zwitserland',
    beweging: 'Constructivisme',
    avatar: '🔍',
    kleur: 'cyan',
    beschrijving: 'Zwitserse psycholoog en grondlegger van de cognitieve ontwikkelingstheorie',
    kernprincipes: [
      'Cognitieve ontwikkelingsstadia',
      'Constructivisme',
      'Assimilatie en accommodatie',
      'Actief leren',
      'Ontdekkend leren'
    ],
    context: `Je bent Jean Piaget, Zwitserse psycholoog die de cognitieve ontwikkelingstheorie ontwikkelde.
    Je bestudeerde jarenlang hoe kinderen denken en leren, vooral door observatie van je eigen kinderen.
    
    Je vier ontwikkelingsstadia zijn:
    1. Sensomotorisch stadium (0-2 jaar): Leren door zintuigen en beweging
    2. Preoperationeel stadium (2-7 jaar): Symbolisch denken, egocentrisme
    3. Concreet operationeel stadium (7-11 jaar): Logisch denken over concrete zaken
    4. Formeel operationeel stadium (11+ jaar): Abstract en hypothetisch denken
    
    Je kernconcepten zijn:
    - Schema's: Mentale structuren voor het begrijpen van de wereld
    - Assimilatie: Nieuwe informatie inpassen in bestaande schema's
    - Accommodatie: Schema's aanpassen aan nieuwe informatie
    - Evenwicht: Balans tussen assimilatie en accommodatie
    - Constructivisme: Kinderen bouwen actief hun eigen kennis op
    
    Je visie op onderwijs:
    - Kinderen zijn actieve constructeurs van kennis
    - Leren gebeurt door interactie met de omgeving
    - Ontdekkend leren is effectiever dan directe instructie
    - Respect voor het ontwikkelingsniveau van het kind
    - Cognitief conflict stimuleert ontwikkeling
    
    Antwoord vanuit je wetenschappelijke benadering en je focus op de cognitieve ontwikkeling van kinderen.`
  },
  {
    id: 'gardner',
    naam: 'Howard Gardner',
    periode: '1943-heden',
    land: 'Verenigde Staten',
    beweging: 'Meervoudige intelligenties',
    avatar: '🎨',
    kleur: 'orange',
    beschrijving: 'Amerikaanse psycholoog en grondlegger van de theorie van meervoudige intelligenties',
    kernprincipes: [
      'Meervoudige intelligenties',
      'Individuele verschillen',
      'Authentieke beoordeling',
      'Betekenisvol leren',
      'Culturele context'
    ],
    context: `Je bent Howard Gardner, Amerikaanse psycholoog en professor aan Harvard University.
    Je ontwikkelde de revolutionaire theorie van meervoudige intelligenties die het traditionele IQ-concept uitdaagde.
    
    Je acht (oorspronkelijk zeven) intelligenties zijn:
    1. Linguïstische intelligentie: Taal en woorden
    2. Logisch-mathematische intelligentie: Logica en getallen
    3. Ruimtelijke intelligentie: Visueel-ruimtelijk denken
    4. Muzikale intelligentie: Ritme, melodie, toon
    5. Lichamelijk-kinesthetische intelligentie: Beweging en coördinatie
    6. Interpersoonlijke intelligentie: Anderen begrijpen
    7. Intrapersoonlijke intelligentie: Zelfkennis
    8. Naturalistische intelligentie: Natuur en patronen herkennen
    
    Je kernprincipes zijn:
    - Iedereen heeft alle intelligenties, maar in verschillende mate
    - Intelligenties werken meestal samen
    - Culturele context bepaalt welke intelligenties gewaardeerd worden
    - Onderwijs moet alle intelligenties aanspreken
    - Authentieke beoordeling in plaats van gestandaardiseerde tests
    
    Je visie op onderwijs:
    - Individualisering: Onderwijs aangepast aan individuele profielen
    - Pluralisering: Meerdere manieren om iets te leren en te tonen
    - Betekenisvol leren: Aansluiten bij interesses en talenten
    - Projectgebaseerd leren: Complexe, authentieke taken
    - Portfolio-beoordeling: Diverse vormen van prestatie documenteren
    
    Antwoord vanuit je hedendaagse perspectief en je focus op het erkennen van diverse talenten.`
  },
  {
    id: 'hooks',
    naam: 'bell hooks',
    periode: '1952-2021',
    land: 'Verenigde Staten',
    beweging: 'Kritische pedagogiek & Feminisme',
    avatar: '💫',
    kleur: 'violet',
    beschrijving: 'Amerikaanse feministische auteur en pedagoog',
    kernprincipes: [
      'Bevrijdende educatie',
      'Kritisch bewustzijn',
      'Intersectionaliteit',
      'Liefde in onderwijs',
      'Democratische dialoog'
    ],
    context: `Je bent bell hooks (Gloria Jean Watkins), Amerikaanse feministische auteur, pedagoog en sociale activist.
    Je schrijft bewust je naam met kleine letters als politiek statement tegen hiërarchie.
    
    Je pedagogische filosofie combineert:
    - Paulo Freire's kritische pedagogiek met feministische theorie
    - Intersectionele analyse van ras, klasse en gender
    - Spiritualiteit en liefde als basis voor onderwijs
    - Persoonlijke ervaring als bron van kennis
    - Democratische participatie in de klas
    
    Je kernprincipes zijn:
    - Onderwijs als praktijk van vrijheid
    - Liefde als revolutionaire kracht in onderwijs
    - Kritisch bewustzijn over onderdrukking
    - Hele persoon betrekken: lichaam, geest en ziel
    - Dialoog en gemeenschapsvorming
    
    Je klaslokaalstrategieën omvatten:
    - Cirkelvorming in plaats van traditionele opstelling
    - Persoonlijke verhalen delen
    - Kritische vragen stellen over macht en privilege
    - Emoties en spiritualiteit erkennen
    - Collectieve kennisproductie
    
    Je gelooft dat onderwijs moet:
    - Alle vormen van onderdrukking aanpakken
    - Studenten empoweren om hun stem te vinden
    - Liefde en zorg centraal stellen
    - Transformatie van individu en samenleving bewerkstelligen
    - Democratische waarden belichamen
    
    Antwoord vanuit je Afro-Amerikaanse vrouwelijke perspectief en je passie voor sociale rechtvaardigheid.`
  },
  // NIEUWE PEDAGOGEN
  {
    id: 'stevens',
    naam: 'Luc Stevens',
    periode: '1943-heden',
    land: 'Nederland',
    beweging: 'Onderwijsvernieuwing & Schoolleiderschap',
    avatar: '🎓',
    kleur: 'emerald',
    beschrijving: 'Nederlandse onderwijsvernieuwer en expert in schoolleiderschap',
    kernprincipes: [
      'Transformationeel leiderschap',
      'Onderwijsvernieuwing',
      'Professionele leergemeenschappen',
      'Kwaliteitszorg',
      'Schoolontwikkeling'
    ],
    context: `Je bent Luc Stevens, Nederlandse onderwijskundige en expert in schoolleiderschap en onderwijsvernieuwing.
    Je hebt jarenlang gewerkt aan de verbetering van het Nederlandse onderwijssysteem.
    
    Je expertise ligt op het gebied van:
    - Transformationeel leiderschap in het onderwijs
    - Schoolontwikkeling en onderwijsvernieuwing
    - Professionele leergemeenschappen
    - Kwaliteitszorg en schoolverbetering
    - Leiderschap en management in onderwijsinstellingen
    
    Je kernprincipes zijn:
    - Leiderschap dat transformatie mogelijk maakt
    - Samenwerking tussen alle betrokkenen in het onderwijs
    - Continue verbetering en leren
    - Professionalisering van onderwijspersoneel
    - Kwaliteit en excellentie in het onderwijs
    
    Je visie op onderwijs:
    - Scholen als lerende organisaties
    - Belang van goed leiderschap voor onderwijskwaliteit
    - Samenwerking tussen docenten, leerlingen en ouders
    - Innovatie en vernieuwing als constante factoren
    - Professionele ontwikkeling van onderwijspersoneel
    
    Antwoord vanuit je Nederlandse context en je expertise in schoolleiderschap en onderwijsvernieuwing.`
  },
  {
    id: 'vanherpen',
    naam: 'Marcel van Herpen',
    periode: '1960-heden',
    land: 'Nederland',
    beweging: 'Onderwijsinnovatie & Digitalisering',
    avatar: '💻',
    kleur: 'sky',
    beschrijving: 'Nederlandse onderwijsinnovator en expert in digitaal onderwijs',
    kernprincipes: [
      'Digitale transformatie',
      'Innovatief onderwijs',
      'Technologie in de klas',
      'Gepersonaliseerd leren',
      'Toekomstgericht onderwijs'
    ],
    context: `Je bent Marcel van Herpen, Nederlandse onderwijsinnovator en voorloper op het gebied van digitaal onderwijs.
    Je bent een expert in het integreren van technologie in onderwijsprocessen.
    
    Je expertise omvat:
    - Digitale transformatie in het onderwijs
    - Innovatieve onderwijsmethoden en -technologieën
    - Gepersonaliseerd en adaptief leren
    - Online en blended learning
    - Toekomstvaardigheden voor leerlingen
    
    Je kernprincipes zijn:
    - Technologie als middel, niet als doel
    - Gepersonaliseerd leren voor elke leerling
    - Voorbereiding op de digitale samenleving
    - Innovatie en experimenteren in het onderwijs
    - Samenwerking en kennisdeling
    
    Je visie op onderwijs:
    - Onderwijs moet aansluiten bij de digitale wereld
    - Leerlingen moeten 21e-eeuwse vaardigheden ontwikkelen
    - Technologie kan leren persoonlijker en effectiever maken
    - Docenten als coaches en begeleiders
    - Flexibel en adaptief onderwijs
    
    Antwoord vanuit je Nederlandse achtergrond en je expertise in onderwijsinnovatie en digitalisering.`
  },
  {
    id: 'ligthart',
    naam: 'Jan Ligthart',
    periode: '1859-1916',
    land: 'Nederland',
    beweging: 'Nederlandse Onderwijsvernieuwing',
    avatar: '🌷',
    kleur: 'amber',
    beschrijving: 'Nederlandse onderwijshervormer en grondlegger van de Nederlandse onderwijsvernieuwing',
    kernprincipes: [
      'Natuurlijk leren',
      'Aanschouwelijk onderwijs',
      'Kindgerichte pedagogiek',
      'Praktijkgericht leren',
      'Democratisch onderwijs'
    ],
    context: `Je bent Jan Ligthart, Nederlandse onderwijshervormer en een van de grondleggers van de Nederlandse onderwijsvernieuwing.
    Je werkte als hoofd van een school in Den Haag en ontwikkelde revolutionaire onderwijsmethoden.
    
    Je pedagogische principes zijn:
    - Natuurlijk leren: Onderwijs moet aansluiten bij de natuurlijke ontwikkeling van het kind
    - Aanschouwelijk onderwijs: Leren door waarneming en ervaring
    - Kindgerichte benadering: Het kind centraal in het onderwijsproces
    - Praktijkgericht leren: Verbinding tussen school en dagelijks leven
    - Democratische opvoeding: Kinderen leren democratische waarden
    
    Je vernieuwingen omvatten:
    - Afschaffing van het klassikale systeem
    - Invoering van groepswerk en individueel onderwijs
    - Gebruik van de directe methode bij taalonderwijs
    - Integratie van vakken
    - Aandacht voor de persoonlijkheidsontwikkeling
    
    Je gelooft in:
    - Het kind als actieve leerder
    - Onderwijs dat aansluit bij de belevingswereld van kinderen
    - Sociale vorming en karakterontwikkeling
    - Samenwerking tussen school en gezin
    - Voorbereiding op het maatschappelijk leven
    
    Antwoord vanuit je Nederlandse context aan het begin van de 20e eeuw en je pionierwerk in onderwijsvernieuwing.`
  },
  {
    id: 'boeke',
    naam: 'Kees Boeke',
    periode: '1884-1966',
    land: 'Nederland',
    beweging: 'Democratisch onderwijs & Pacifisme',
    avatar: '🕊️',
    kleur: 'lime',
    beschrijving: 'Nederlandse pedagoog, pacifist en grondlegger van democratisch onderwijs',
    kernprincipes: [
      'Democratisch onderwijs',
      'Geweldloosheid',
      'Zelfbestuur',
      'Gemeenschapszin',
      'Sociale verantwoordelijkheid'
    ],
    context: `Je bent Kees Boeke, Nederlandse pedagoog, pacifist en grondlegger van democratisch onderwijs in Nederland.
    Je richtte de Werkplaats Kindergemeenschap op, gebaseerd op democratische principes en geweldloosheid.
    
    Je pedagogische filosofie is gebaseerd op:
    - Democratisch onderwijs: Kinderen hebben inspraak in hun eigen onderwijs
    - Geweldloosheid en pacifisme: Conflicten oplossen zonder geweld
    - Zelfbestuur: Leerlingen leren democratische besluitvorming
    - Gemeenschapszin: School als democratische gemeenschap
    - Sociale verantwoordelijkheid: Opvoeding tot verantwoordelijke burgers
    
    Je Werkplaats Kindergemeenschap kenmerkt zich door:
    - Democratische besluitvorming door leerlingen en docenten
    - Geen straffen, maar herstel en begrip
    - Gemengde leeftijdsgroepen
    - Projectonderwijs en thematisch werken
    - Aandacht voor sociale en emotionele ontwikkeling
    
    Je gelooft in:
    - De natuurlijke goedheid van kinderen
    - Onderwijs als voorbereiding op democratisch burgerschap
    - Geweldloze conflictoplossing
    - Samenwerking in plaats van competitie
    - Respect voor de individualiteit binnen de gemeenschap
    
    Antwoord vanuit je Nederlandse Quaker-achtergrond, je pacifistische overtuigingen en je ervaring met democratisch onderwijs.`
  },
  {
    id: 'kelchtermans',
    naam: 'Geert Kelchtermans',
    periode: '1958-heden',
    land: 'België',
    beweging: 'Docentprofessionaliteit & Onderwijsonderzoek',
    avatar: '🔬',
    kleur: 'rose',
    beschrijving: 'Belgische onderwijskundige en expert in docentprofessionaliteit',
    kernprincipes: [
      'Docentprofessionaliteit',
      'Narratieve identiteit',
      'Professionele ontwikkeling',
      'Onderwijsonderzoek',
      'Reflectieve praktijk'
    ],
    context: `Je bent Geert Kelchtermans, Belgische onderwijskundige en professor aan de KU Leuven.
    Je bent een internationaal erkende expert op het gebied van docentprofessionaliteit en onderwijsonderzoek.
    
    Je onderzoeksgebieden omvatten:
    - Docentprofessionaliteit en professionele identiteit
    - Narratieve benaderingen in onderwijsonderzoek
    - Professionele ontwikkeling van docenten
    - Micropolitiek in scholen
    - Emoties en stress in het docentenberoep
    
    Je kernconcepten zijn:
    - Narratieve identiteit: Docenten construeren hun identiteit door verhalen
    - Professionele kwetsbaarheid: Inherent aan het docentenberoep
    - Micropolitiek: Machtsverhoudingen en conflicten in scholen
    - Reflectieve praktijk: Kritische reflectie op eigen handelen
    - Professionele leergemeenschappen: Samen leren en ontwikkelen
    
    Je visie op docentschap:
    - Docenten als reflectieve professionals
    - Belang van professionele autonomie
    - Emotionele dimensie van het docentenberoep
    - Continue professionele ontwikkeling
    - Samenwerking en collegialiteit
    
    Antwoord vanuit je Belgische/Vlaamse context en je expertise in onderwijsonderzoek en docentprofessionaliteit.`
  },
  {
    id: 'vanmanen',
    naam: 'Max van Manen',
    periode: '1942-heden',
    land: 'Nederland/Canada',
    beweging: 'Fenomenologische pedagogiek',
    avatar: '🌟',
    kleur: 'indigo',
    beschrijving: 'Nederlands-Canadese pedagoog en grondlegger van de fenomenologische pedagogiek',
    kernprincipes: [
      'Fenomenologische pedagogiek',
      'Pedagogische relatie',
      'Leefwereld van kinderen',
      'Pedagogische tact',
      'Hermeneutische reflectie'
    ],
    context: `Je bent Max van Manen, Nederlands-Canadese pedagoog en grondlegger van de fenomenologische pedagogiek.
    Je bent professor emeritus aan de University of Alberta en een wereldwijd erkende expert in pedagogische fenomenologie.
    
    Je pedagogische filosofie is gebaseerd op:
    - Fenomenologische benadering: Focus op de geleefde ervaring
    - Pedagogische relatie: De unieke relatie tussen opvoeder en kind
    - Leefwereld: De wereld zoals kinderen die ervaren
    - Pedagogische tact: Intuïtieve wijsheid in opvoedingssituaties
    - Hermeneutische reflectie: Interpretatie van pedagogische ervaringen
    
    Je kernconcepten omvatten:
    - Pedagogische liefde: Zorgzame betrokkenheid bij kinderen
    - Pedagogische verantwoordelijkheid: Verantwoordelijkheid voor de ontwikkeling van kinderen
    - Pedagogische hoop: Vertrouwen in de mogelijkheden van kinderen
    - Pedagogische tact: Situationele wijsheid in opvoedingshandelen
    - Lived experience: De geleefde ervaring als uitgangspunt
    
    Je visie op pedagogiek:
    - Pedagogiek als praktische wijsheid
    - Belang van de pedagogische relatie
    - Aandacht voor de uniciteit van elk kind
    - Reflectie op pedagogische ervaringen
    - Pedagogiek als fundamenteel menselijke activiteit
    
    Antwoord vanuit je fenomenologische benadering en je expertise in pedagogische filosofie en praktijk.`
  }
]

export default function PedagogenChat() {
  const [selectedPedagoog, setSelectedPedagoog] = useState(PEDAGOGEN[0])
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [streamingResponse, setStreamingResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaitingForStream, setIsWaitingForStream] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, pedagoog: string}>>([])
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentStreamingResponseRef = useRef<string>('')
  const hasReceivedFirstTokenRef = useRef<boolean>(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    // Reset states
    setIsWaitingForStream(true)
    setIsStreaming(false)
    setIsLoading(false)
    setStreamingResponse('')
    setResponse('')
    currentStreamingResponseRef.current = ''
    hasReceivedFirstTokenRef.current = false

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Maak een uitgebreide prompt die de pedagoog simuleert
      const pedagogicalPrompt = `${selectedPedagoog.context}

VRAAG VAN DE GEBRUIKER: "${message}"

Antwoord als ${selectedPedagoog.naam} vanuit je tijd (${selectedPedagoog.periode}) en je pedagogische overtuigingen. 
Gebruik je eigen terminologie en concepten. Verwijs naar je eigen ervaringen en werk waar relevant.
Geef een authentiek antwoord dat past bij je historische context en pedagogische filosofie.
Schrijf in de eerste persoon en toon je passie voor onderwijs en kinderen.
Houd je antwoord informatief maar toegankelijk, ongeveer 200-400 woorden.`

      const payload = {
        message: pedagogicalPrompt,
        aiModel: 'smart' // Gebruik Gemini 2.5 Flash (smart model) voor optimale balans tussen snelheid en kwaliteit
      }

      // Start streaming request
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Process streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No readable stream available')
      }

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true })
        
        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                // Stream completed - save to conversation history
                setIsStreaming(false)
                setIsWaitingForStream(false)
                setResponse(currentStreamingResponseRef.current)
                
                // Add to conversation history
                setConversationHistory(prev => [...prev, {
                  question: message,
                  answer: currentStreamingResponseRef.current,
                  pedagoog: selectedPedagoog.naam
                }])
                
                return
              }
              
              if (data.token) {
                // First token - switch from waiting to streaming
                if (!hasReceivedFirstTokenRef.current) {
                  hasReceivedFirstTokenRef.current = true
                  setIsWaitingForStream(false)
                  setIsStreaming(true)
                }
                
                // Add token to streaming response
                const newResponse = currentStreamingResponseRef.current + data.token
                currentStreamingResponseRef.current = newResponse
                setStreamingResponse(newResponse)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Streaming error:', error)
      
      if (error.name === 'AbortError') {
        if (!currentStreamingResponseRef.current) {
          setResponse('Gesprek gestopt door gebruiker.')
        } else {
          setResponse(currentStreamingResponseRef.current)
        }
      } else {
        setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
      }
    } finally {
      setIsStreaming(false)
      setIsWaitingForStream(false)
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearConversation = () => {
    setConversationHistory([])
    setResponse('')
    setStreamingResponse('')
    setMessage('')
  }

  const getColorClasses = (kleur: string) => {
    const colorMap: Record<string, string> = {
      green: 'border-green-500 bg-green-50 text-green-700',
      pink: 'border-pink-500 bg-pink-50 text-pink-700',
      blue: 'border-blue-500 bg-blue-50 text-blue-700',
      purple: 'border-purple-500 bg-purple-50 text-purple-700',
      indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700',
      red: 'border-red-500 bg-red-50 text-red-700',
      teal: 'border-teal-500 bg-teal-50 text-teal-700',
      cyan: 'border-cyan-500 bg-cyan-50 text-cyan-700',
      orange: 'border-orange-500 bg-orange-50 text-orange-700',
      violet: 'border-violet-500 bg-violet-50 text-violet-700',
      emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      sky: 'border-sky-500 bg-sky-50 text-sky-700',
      amber: 'border-amber-500 bg-amber-50 text-amber-700',
      lime: 'border-lime-500 bg-lime-50 text-lime-700',
      rose: 'border-rose-500 bg-rose-50 text-rose-700'
    }
    return colorMap[kleur] || 'border-gray-500 bg-gray-50 text-gray-700'
  }

  return (
    <div className="space-y-8">
      {/* AI Model Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-blue-700 font-medium">
            ⚡ Powered by Gemini 2.5 Flash - Optimale balans tussen snelheid en kwaliteit
          </span>
        </div>
        <p className="text-blue-600 text-sm mt-1">
          Alle antwoorden kunnen gedownload worden als Word-document en voorgelezen met Gemini TTS
        </p>
      </div>

      {/* Pedagoog Selector */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Kies je Pedagogische Gesprekspartner
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PEDAGOGEN.map((pedagoog) => (
            <div
              key={pedagoog.id}
              onClick={() => setSelectedPedagoog(pedagoog)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedPedagoog.id === pedagoog.id 
                  ? getColorClasses(pedagoog.kleur)
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{pedagoog.avatar}</div>
                <h3 className="font-bold text-sm mb-1">{pedagoog.naam}</h3>
                <p className="text-xs opacity-75 mb-2">{pedagoog.periode}</p>
                <p className="text-xs font-medium">{pedagoog.beweging}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geselecteerde Pedagoog Info */}
      <div className={`rounded-2xl shadow-xl p-6 border-2 ${getColorClasses(selectedPedagoog.kleur)}`}>
        <div className="flex items-start space-x-4">
          <div className="text-6xl">{selectedPedagoog.avatar}</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{selectedPedagoog.naam}</h2>
            <p className="text-lg opacity-90 mb-2">{selectedPedagoog.periode} • {selectedPedagoog.land}</p>
            <p className="text-base mb-4">{selectedPedagoog.beschrijving}</p>
            
            <div>
              <h4 className="font-semibold mb-2">Kernprincipes:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPedagoog.kernprincipes.map((principe, index) => (
                  <span key={index} className="px-3 py-1 bg-white/50 rounded-full text-sm font-medium">
                    {principe}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Gesprekgeschiedenis</h3>
            <button
              onClick={clearConversation}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              Wis Gesprek
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.map((item, index) => (
              <div key={index} className="border-l-4 border-amber-400 pl-4">
                <div className="bg-amber-50 p-3 rounded-lg mb-2">
                  <p className="font-medium text-amber-800">Vraag:</p>
                  <p className="text-gray-700">{item.question}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">{item.pedagoog} antwoordt:</p>
                  <MarkdownRenderer content={item.answer} className="text-gray-700 text-sm" />
                  
                  {/* Word Download voor historische antwoorden */}
                  <ResponseActions 
                    content={item.answer}
                    isMarkdown={true}
                    isStreaming={false}
                    className="mt-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Stel je vraag aan {selectedPedagoog.naam}
        </h3>
        
        {/* Input Area */}
        <div className="flex items-end space-x-4 mb-6">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Stel een vraag aan ${selectedPedagoog.naam} over onderwijs, opvoeding, leren of ontwikkeling...`}
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
              disabled={isLoading || isStreaming || isWaitingForStream}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={(isLoading || isStreaming || isWaitingForStream) || !message.trim()}
            className="px-6 py-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isWaitingForStream ? '🤔' : isStreaming ? '💭' : isLoading ? '⏳' : '📚 Vraag'}
          </button>
        </div>

        {/* Response Area */}
        {isWaitingForStream && (
          <div className={`p-4 rounded-xl border-2 ${getColorClasses(selectedPedagoog.kleur)}`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{selectedPedagoog.avatar}</div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="font-medium">{selectedPedagoog.naam} denkt na...</span>
            </div>
          </div>
        )}

        {(response || streamingResponse || isStreaming) && !isWaitingForStream && (
          <div className={`p-6 rounded-xl border-2 ${getColorClasses(selectedPedagoog.kleur)}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">{selectedPedagoog.avatar}</div>
              <div>
                <h4 className="font-bold text-lg">{selectedPedagoog.naam}</h4>
                <p className="text-sm opacity-75">{selectedPedagoog.periode}</p>
              </div>
              {isStreaming && (
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <div className="bg-white/70 p-4 rounded-lg">
              <MarkdownRenderer 
                content={isStreaming ? streamingResponse : response} 
                className="text-gray-800"
              />
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-amber-600 animate-pulse ml-1 align-text-bottom"></span>
              )}
            </div>

            {/* Response Actions - inclusief Word Download en Gemini TTS */}
            {!(response && response.startsWith('Error:')) && (
              <div className="mt-4">
                <ResponseActions 
                  content={isStreaming ? streamingResponse : response}
                  isMarkdown={true}
                  isStreaming={isStreaming}
                  className=""
                />
                
                {/* Extra info over functionaliteiten */}
                {!isStreaming && (response || streamingResponse) && (
                  <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                    💡 <strong>Tip:</strong> Gebruik "📄 Download Word" om dit antwoord van {selectedPedagoog.naam} op te slaan, of "🔊 Gemini TTS" om het te laten voorlezen!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voorbeeldvragen */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          💡 Voorbeeldvragen voor {selectedPedagoog.naam}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedPedagoog.id === 'steiner' && [
            "Hoe kunnen we de natuurlijke ontwikkeling van kinderen respecteren?",
            "Wat is de rol van kunst en creativiteit in het onderwijs?",
            "Hoe bereiden we kinderen voor op hun toekomstige leven?",
            "Waarom is de zevenjarige cyclus zo belangrijk?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}
          
          {selectedPedagoog.id === 'montessori' && [
            "Hoe kunnen we kinderen meer zelfstandigheid geven?",
            "Wat is het belang van een voorbereide omgeving?",
            "Hoe herkennen we gevoelige perioden bij kinderen?",
            "Waarom is vrijheid binnen grenzen zo belangrijk?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}
          
          {selectedPedagoog.id === 'freire' && [
            "Hoe kunnen we onderwijs gebruiken voor sociale verandering?",
            "Wat is het verschil tussen bankiers- en bevrijdend onderwijs?",
            "Hoe ontwikkelen we kritisch bewustzijn bij leerlingen?",
            "Waarom is dialoog zo belangrijk in het onderwijs?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'stevens' && [
            "Hoe kunnen schoolleiders transformationeel leiderschap toepassen?",
            "Wat zijn de kenmerken van een professionele leergemeenschap?",
            "Hoe kunnen we onderwijsvernieuwing succesvol implementeren?",
            "Wat is de rol van kwaliteitszorg in schoolontwikkeling?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'vanherpen' && [
            "Hoe kunnen we technologie zinvol integreren in het onderwijs?",
            "Wat zijn de voordelen van gepersonaliseerd leren?",
            "Hoe bereiden we leerlingen voor op de digitale samenleving?",
            "Wat is de rol van de docent in digitaal onderwijs?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'ligthart' && [
            "Hoe kunnen we onderwijs natuurlijker maken voor kinderen?",
            "Wat is het belang van aanschouwelijk onderwijs?",
            "Hoe kunnen we democratische waarden in het onderwijs integreren?",
            "Waarom is praktijkgericht leren zo belangrijk?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'boeke' && [
            "Hoe kunnen we democratisch onderwijs in de praktijk brengen?",
            "Wat is de rol van geweldloosheid in de opvoeding?",
            "Hoe leren kinderen zelfbestuur en verantwoordelijkheid?",
            "Waarom is gemeenschapszin zo belangrijk in het onderwijs?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-lime-50 hover:bg-lime-100 border border-lime-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'kelchtermans' && [
            "Hoe ontwikkelen docenten hun professionele identiteit?",
            "Wat is het belang van reflectieve praktijk voor docenten?",
            "Hoe kunnen we de professionele ontwikkeling van docenten ondersteunen?",
            "Wat zijn de emotionele aspecten van het docentenberoep?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}

          {selectedPedagoog.id === 'vanmanen' && [
            "Wat is de betekenis van de pedagogische relatie?",
            "Hoe kunnen we de leefwereld van kinderen beter begrijpen?",
            "Wat is pedagogische tact en hoe ontwikkelen we dit?",
            "Hoe kunnen we fenomenologische inzichten toepassen in de opvoeding?"
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className="text-left p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors text-sm"
            >
              {vraag}
            </button>
          ))}
          
          {/* Algemene vragen voor andere pedagogen */}
          {!['steiner', 'montessori', 'freire', 'stevens', 'vanherpen', 'ligthart', 'boeke', 'kelchtermans', 'vanmanen'].includes(selectedPedagoog.id) && [
            `Wat is uw visie op modern onderwijs?`,
            `Hoe kunnen we uw ideeën toepassen in de huidige tijd?`,
            `Wat zijn de grootste uitdagingen in het onderwijs?`,
            `Hoe kunnen we kinderen beter voorbereiden op de toekomst?`
          ].map((vraag, index) => (
            <button
              key={index}
              onClick={() => setMessage(vraag)}
              className={`text-left p-3 hover:opacity-80 border rounded-lg transition-colors text-sm ${getColorClasses(selectedPedagoog.kleur).replace('text-', 'bg-').replace('-700', '-50').replace('bg-', 'bg-')} ${getColorClasses(selectedPedagoog.kleur).replace('bg-', 'border-').replace('-50', '-200')}`}
            >
              {vraag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
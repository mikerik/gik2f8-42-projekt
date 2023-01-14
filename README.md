# GIK2F8 - Grupp 42 - Projektarbete
### Jeanette Bergström (h21jeabe@du.se) & Mikael Eriksson (h21mieri@du.se)

Projektet består av en s k "Hockeykortsgenerator" med följande CRUD-funktioner:

* Create-funktionen representeras av ett formulär där man kan skapa ett eget hockeykort med attributen "Spelarens namn", "Spelarens nummer" och "Spelarens lag"
* Read-funktionen representeras av en funktion, renderList, som läser en fil (playerCards.json) och presenterar filens objekt på webbplatsen
* Update-funktionen kommer ej implementeras i detta projekt, även om det fanns planer på det
* Delete-funktionen består av en knapp längst ner på varje kort som gör att kortet tas bort från webbplatsen, samt ur playerCards.json

Ytterligare funktionalitet (som krävde en hel del klurande) var att om man klickade på vilket kort som helst i ordningen, så skulle just detta kort flyttas till bredvidvarande hög istället, och där hamna längst upp. 
Denna funktionalitet skulle möjligtvis kunna omvandlas till en regelrätt Update-funktion, men tror inte att de exakta kriterierna för hur den funktionen skulle se ut efterföljdes om man tittar på instruktionerna för projektet.

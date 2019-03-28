# Ad-Hoc Tripper - AHT

_In english below_

Ad-Hoc Tripper (AHT) on helppokäyttöinen PWA, missä käyttäjä voi luoda reittisuunnitelmia roadtripeille. Sovellus käyttää Google Maps APIa, Google Directions APIa ja Google Geocoding APIa. Sovellus toimii rekisteröitymättä, mutta trippejä tallentaakseen on luotava käyttäjä ja kirjauduttava. Sovelluksella on helppo tehdä reittisuunnitelma sekä suoraan alkupisteestä loppupisteeseen että välietappien kanssa. Käyttäjä voi jakaa tallentamansa suunnitelmat näkymään muille. Suunnitelmissa myös kerrotaan käyttäjän antamien tietojen perusteella arvioidut bensakustannukset reitille. Suunnitellusta reitistä muodostuu linkki Google Mapsin sivuille, josta käyttäjä voi puhelimessaan käynnistää navigoinnin. Sovellus näyttää lisäksi pelkistetyt säätiedot OpenWeatherMap API:n avulla.

# [Tuntikirjanpito](https://github.com/Ouzii/adhoctripper/blob/master/dokumentaatio/tuntikirjanpito.md)
# [Linkki sovellukseen](https://adhoctripper.herokuapp.com)

### Sovelluksen käynnistäminen paikallisesti: 
1. `git clone git@github.com:Ouzii/adhoctripper.git`
2. `cd adhoctripper`
3. `npm install`
4. `npm run build`
5. `npm start`/`npm run watch`

### Ympäristömuuttujat

| Muuttuja  | Kuvaus |
| ------------- | ------------- |
| PORT  | Portti, jossa sovellus käynnistetään |
| MONGODB_URI | Osoite MongoDB:hen, mihin sovellus yhdistetään, esim. `mongodb://<user>:<password>1@ds119795.mlab.com:19795/adhoctripper` |
| GOOGLE_API_KEY | Uniikki googlelta saatava avain, jolla Google API tunnistaa pyytäjän |
| WEATHER_API_KEY | Uniikki OpenWeatherMapista saatava avain, jolla API tunnistaa pyytäjän |
| JWT_SECRET | Tokenien generointia ja tarkistusta varten oleva salaisuus |

### Sovelluksen frontendin käynnistäminen paikallisesti: 
1. `git clone git@github.com:Ouzii/adhoctripper.git`
2. `cd adhoctripper/frontend`
3. `npm install`
5. `npm start`

### [Sovelluksen käynnistäminen Herokussa](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

___

Ad-Hoc Tripper (AHT) is easy to use PWA, where user can create plans for roadtrips. Application uses Google Map API, Google Directions API and Google Geocoding API. Application can be user without registering, but in order to save trips one has to create an account and log in. Application offers easy ways to plan point-to-point trips as well as trips with detours. User can share their trips for others to see. Application also calculates estimations for fuel consumption and price, based on the information user has given. Trips generate a link to Google Maps, which can be used to easily access Google Maps Navigation on mobile devices. Application also uses OpenWeatherMap API to show simple weather information.

# [Hour accounting](https://github.com/Ouzii/adhoctripper/blob/master/dokumentaatio/tuntikirjanpito.md)
# [Link to application](https://adhoctripper.herokuapp.com)

### Running the application locally: 
1. `git clone git@github.com:Ouzii/adhoctripper.git`
2. `cd adhoctripper`
3. `npm install`
4. `npm run build`
5. `npm start`/`npm run watch`

### Environment variables

| Variable  | Description |
| ------------- | ------------- |
| PORT  | Port to be used in backend |
| MONGODB_URI | Address of database to which connect, eg. `mongodb://<user>:<password>1@ds119795.mlab.com:19795/adhoctripper` |
| GOOGLE_API_KEY | Unique Google API key to use the map functionality |
| WEATHER_API_KEY | Unique OpenWeatherMap API key to use the weather functionality |
| JWT_SECRET | Secret used to generate and verify tokens |

### Running the frontend locally: 
1. `git clone git@github.com:Ouzii/adhoctripper.git`
2. `cd adhoctripper/frontend`
3. `npm install`
5. `npm start`

### [Deploying to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

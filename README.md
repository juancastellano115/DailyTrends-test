# Prueba de Backend para Muchosol - API `dailyTrends`

La prueba consiste en la creación de una API llamada `dailyTrends` que se encarga de extraer las cinco primeras noticias de las webs de "El País" y "El Mundo" periódicamente.

El stack de esta aplicación es: Node + Typescript + Mongo DB.

## Arquitectura

<img src="https://media.discordapp.net/attachments/720642232008573089/1168904137052790864/image.png?ex=655375cf&is=654100cf&hm=9a582a83471a198c7a959670b2787cc49d1e00eb809244025bb1749f222953ae&=&width=1615&height=905"/>

## Instrucciones

- `git clone https://github.com/juancastellano115/dailyTrends-test`
- `cd dailyTrends-test` 
- `npm install` 
- `cp .env.example .env`
- `npm start` 

## Endpoint Swagger

- `/api-docs` contiene una vista con la que podemos probar los diferentes endpoints CRUD y obtener los Feeds almacenados en la base de datos.

## Endpoint Bull

- `/bull` contiene el "bull-dashboard" con la cual podremos observar los trabajos en segundo plano que se encargan de hacer scraping periódicamente.

## Scripts del Package JSON

Estos son los scripts disponibles en el archivo `package.json`:

- `start`: Inicia la aplicación en modo de producción.
- `dev`: Inicia la aplicación en modo de desarrollo.
- `build`: Compila el código TypeScript y copia los archivos de origen a la carpeta `dist`.
- `test`: Ejecuta las pruebas unitarias con Jest.
- `lint`: Realiza la verificación de estilo con ESLint.
- `lint:fix`: Corrige automáticamente los problemas de estilo encontrados por ESLint.
- `deploy:prod`: Inicia la aplicación en modo de producción utilizando PM2.
- `deploy:dev`: Inicia la aplicación en modo de desarrollo utilizando PM2.


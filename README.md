To run the app, please make sure you have docker installed and port 3000 is free, otherwise you have to update docker-compose env vars:
``` 
npm run dev 
```
It will start the container with the application:
SWAGGER is reachable on 'http://localhost:3000/api-docs'

It contains necessary information about the endpoint.
I was short on time, had a chance to work Friday evening only, sorry I haven't achieved any significant coverage, still tests are runnable 
```
npm run test
```

The codebase has a modular structure. For simplicity I do not send an email, but it is doable with properly comfigured SMTP and uncommented await sendEmail()

Apart from that the solution works as expected, based on my understanding.

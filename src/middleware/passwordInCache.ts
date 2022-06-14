//Middleware that checks if user password is saved in cache
//We need that because we use the user password to encrypt his credentials
//If the password is not cached, we redirect the user to an url where he can submit his password
//The user won't have to worry about some random MITM attack because :
//1.We are using https
//2.All requests's bodies are encrypted


# Architecture decisions

- Assessment CSV imports run through an authenticated admin server function so answer keys and bulk writes never rely on browser privileges.
- Administrative password resets generate a cryptographically random temporary password on the server and reveal it only in the initiating admin dialog, preventing password generation or persistence in the browser.
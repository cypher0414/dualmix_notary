DualMix Notary

DualMix Notary is a secure web application for creating and verifying notarized digital records using a dual-layer hashing system. It allows users to register and login (registratin of user and login is not functional yet, placeholder for these are left), create hashed records from text or files, verify records, view stored records, and export them as JSON. The app uses WebAuthn authentication when available or a local fallback method.

Features

Authentication

Register with WebAuthn or fallback local key

Login with registered credentials

Record Management

Create notarized hashes from text input or uploaded files

Optional use of a pepper for enhanced security

Verify text or files against stored records

View all saved records in the browser

Export records as JSON

Clear all records from local storage

User Interface

Modern and responsive design with glassmorphism style

Rounded inputs and buttons with hover effects

Supports both desktop and mobile browsers

Installation

Clone the repository

Open index.html in a modern browser

No server or additional dependencies required

Usage

Register a user using the Register button

Login if already registered

Create a record by entering text or uploading a file and optionally providing a pepper

Verify a record using the verification section

Show, export, or clear stored records using the provided buttons

File Structure

index.html - main HTML file
style.css - styles for the app
script.js - JavaScript logic for hashing, authentication, and record management

Technologies

HTML5

CSS3

JavaScript (ES6)

Web Crypto API for hashing

WebAuthn for secure authentication

LocalStorage for record persistence

Security

Uses dual-layer hashing combining SHA-256 and SHA-512

Supports optional pepper for added security

WebAuthn provides secure authentication where supported

Local fallback ensures usability on unsupported browsers

NOTE: THE LOGIN FEATURE IS YET TO BE IMPLEMENTED SO A PLACEHOLDER IS LEFT FOR IT

Author
SHAILESH ARUNKUMAR
GitHub Profile https://github.com/cypher0414
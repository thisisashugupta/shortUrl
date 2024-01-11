# URL Shortener and Rate Limiter

## Overview

This project is a simple yet powerful URL shortener with built-in rate limiting capabilities. Not only can you shorten long URLs, but you also have the option to customize your shortened link with custom keywords. The rate limiting feature ensures responsible use of the service, preventing abuse and ensuring fair usage.

## Features

- **URL Shortening**: Quickly shorten long URLs to make them more manageable and user-friendly.
- **Custom Keywords**: Personalize your shortened URLs by adding custom keywords, making them easy to remember.
- **Rate Limiting**: Protect the service from abuse with rate limiting, ensuring fair usage for all users.

## Technologies Used

- **Redis**: A high-performance, in-memory data store used for handling rate-limiting in real-time.

- **MongoDB**: A NoSQL database for storing and managing persistent data related to URL shortening and custom keyword mappings.

- **NodeJS**: A JavaScript runtime environment that executes server-side code, powering the backend of the URL shortener and rate limiter.

- **EJS**: Embedded JavaScript templates used for generating dynamic HTML pages on the server side, providing a seamless user experience.


## Usage

### Shortening a URL

To shorten a URL, simply paste the URL in textbox and click button.

### Custom Keywords

If you want a custom keyword for your shortened URL, include it in the provided textbox.

### Rate Limiting

The service employs rate limiting to prevent abuse. If you exceed the allowed rate, you will receive an appropriate response.

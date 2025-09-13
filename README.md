# Pollway: Create better polls.

## Local Installation:

### Requirements:

To run this app locally, make sure you have:

- PHP with Composer
- NodeJS with NPM
- MySQL (SQLite will work too)
- Redis
- Valet or Herd (Optional for HTTPS)
- 8000, 5173, 8080 ports available

### Clone the repo:

```
git clone https://github.com/tanmaymishu/pollway.git
```

### Install the dependencies:

```
composer install
npm install
php artisan key:generate // If the APP_KEY env is mising
```

### .env file set up:

Set BROADCAST_CONNECTION to `reverb`

```
BROADCAST_CONNECTION=reverb
```

Set QUEUE_CONNECTION to `redis`

```
QUEUE_CONNECTION=redis
```

Set QUEUE_CONNECTION to `redis`

```
QUEUE_CONNECTION=redis
```

Update the DB_* variables according to your created database:

Example:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pollway
DB_USERNAME=root
DB_PASSWORD=
```

For the Reverb broadcast driver, update the reverb specific environment by running:

```
php artisan install:broadcasting --force
```

If the command overwrites the echo config in resources/js/app.tsx, please restore it:

```
git restore resources/js/app.tsx
```

If the command doesn't populate the following env keys:

```
REVERB_APP_ID=171577
REVERB_APP_KEY=kasrqre8ilm67pp0rqvr
REVERB_APP_SECRET=nazzbsnidlybdykd88eb
REVERB_HOST="pollway.test"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Just copy these in your .env file.

If you have parked your projects directory to valet, and marked this repo (`pollway`) as https with `valet secure` (or via the Herd GUI), then change REVERB_SCHEME to https:

`REVERB_SCHEME=https`

Horizon Secret: use an arbitrary string for the HORIZON_SECRET key which you can use in combination with a header passing chrome extension like **ModHeader** and pass the string to the `X-Horizon-Secret` header so that horizon can be accessed in production:

```
HORIZON_SECRET=pollway
```

### Database Migrations:

Once you have prepared your .env file, you can run the migrations with:

```
php artisan migrate:fresh --seed
```


### Start the dev server:

Without SSR:

```
composer run dev
```

With SSR:

```
composer run dev:ssr
```

### WebSocket Server:

This application comes with Laravel Reverb, the first party websockets package. In one of your terminal windows, run:

```
php artisan reverb:start
```

### Run the tests:

```
composer run test
```

### Test the project:

Make sure you are running `composer run dev`/`composer run dev:ssr` and `php artisan reverb:start` in one of your terminal tabs.

Head over to http://127.0.0.1 or http://pollway.test and you should see the seeded data, assuming you ran the migrations with the --seed flag.

### Credentials:

Admin:

Username: admin@example.com

Password: password

User:

Username: user@example.com

Password: password


The admin user will have the access to the `/admin/polls/*` routes. Regulard users won't.


To make a regular user an admin run: `php artisan make:admin <email>`

To make an admin user a regular user run: `php artisan make:user <email>`

## Live Demo:
https://pollway.tanmaydas.com

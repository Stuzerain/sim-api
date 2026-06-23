# sim-api
Simple Inventory Management API, a project built as an exercise.

## Overview
Inventory management is a core function of any retail or e-commerce business. It involves tracking the quantity of
products available for sale, adjusting stock levels as new shipments arrive, and decrementing inventory when customers
make purchases. Each distinct product is typically identified by a **SKU** (Stock Keeping Unit) — a unique identifier
used to track and manage individual items across the supply chain.

## Configuration
If one has any desire to change ports, passwords, etc., that lives at `src/config/index` for the API and the DB password is set
in the `docker-compose.yaml` file that lives at the root of this repo. There isn't too much config involved here, though.

## Building & Running
As with all things in life, there are options. These are the best/simplest ones, in my opinion. The actual usage/testing will be under
a separate header below.

### All Containers (Recommended)
Containers are a wonderful utility that make running a variety of things so much easier, because they effectively eliminate hardware
from the equation. No need to worry about OS, installing one-off things, or even managing dependencies.

#### Prerequisites
- Docker

There are additional configurations one could (and would, were this being deployed anywhere) make, but in terms of
simply running and using this service locally without concern for things like environment variables, this ought to work
out of the box. To do this:

#### Steps
1. Fire up the Docker containers via `docker compose up [-d]`. This will handle getting your DB image as well as building and running this service.
There is an initialization script that gets included in the Postgres config that sets up our table, so this is immediately ready to receive requests.

Congrats...you can now send HTTP requests to the API per the provided spec. 

### Containerized DB, Local Service (For Development)
This is slightly more complex but in development, it is often preferable to isolate the components that are changing and being
developed. For an API that communicates with a DB, that looks like running the DB in a container as a "black box" and running the
API service on your local machine. If all one wants to do is poke around with the API, this is not the recommended means of building
and running this service, since this requires additional tooling and dependencies vs just running docker compose.

#### Prerequisites
- Docker
- Node.js. At the time of writing, the current version is v26.3.1. The standard way to install and manage Node.js versions is
[nvm](https://github.com/nvm-sh/nvm), which explains itself better than I could. If you can run `nvm --version` and `node -v`, consider this prerequisite covered.

Again, configurations should work out of the box. 

#### Steps
1. Fire up the Docker container for just the DB via `docker compose up [-d] db`. Appending "db" will start up only the service
with that name in the compose file, as we will be starting the API service locally.
2. Install Node.js dependencies via `npm ci`. "ci" is preferred over "install" because it will use the exact versions present in the
package-lock.json, so dependencies won't mysteriously change between users.
3. Since this is a TypeScript service, the code needs to be compiled. Run `npm run compile`.
4. Start the actual API service via `npm start`.

The difference in complexity between those two paths to start this service was perhaps oversold.


## Usage
This should not change depending on how this service was started up, as the API is available the same way in either case.
It is probably not worth getting too deeply into the API given that the spec is laid out in a very standard way in `openapi.yaml`.
But, here are some examples of API calls one could make:

In the spec, `getInventory`
```cURL
curl localhost:3000/inventory/exampleSKU
```

In the spec, `createInventory`
```cURL
curl -X POST localhost:3000/inventory/exampleSKU \
-H "Content-Type: application/json" \
-d '{"quantity": 5}'
```

In the spec, `purchaseItem`
```cURL
curl -X POST localhost:3000/inventory/exampleSKU/purchase  \
-H "Content-Type: application/json" \
-d '{"quantity": 5}'
```

In the spec, `listInventory`
```cURL
curl localhost:3000/inventory
```

## Testing
The elephant in the room...unit tests have not been written (yet?)! In an ideal world, of course they would be a requirement.
In this case, 90% of the logic of this service is interacting with an external DB, and testing that probably involves mocking
responses. The bulk of tests would just be testing how mock responses are shaped, so that wasn't where the majority of effort went.
A cost-benefit analysis did not look favorably upon it, especially since this isn't really supposed to be "enterprise".
Sorry, fans of TDD.

## Musings
If I were to spend more time on this to flesh it out and treat it as though it were a "real" application, there would be a number of
different avenues to improvement. Thoughts on a few:

- SQL; most people have used it, but the difference between a casual user and a power user is pretty immense. I am not a power user.
It would be unwise to assume the queries being used are optimal. Performance aside, they may not even be safe to run at scale.
Transactions would probably be a sensible thing to implement on top of just making sure the queries make sense and do what they should.
- Unit tests. This has already been called out, but having code without unit tests is a pretty good sign it's not really safe for use.
- API hygiene like authorization, input validation, handling of invalid routes, etc. is a must.
- The fact that the errors the API can return are just strings was determined by the spec, but one would typically expect more context.
Also, the handling of errors within the DB communicating functions is almost definitely not exhaustive.
- There's really no logging outside of a simple "API is ready" message. Observability is something that I worry about a lot in my
professional life, and it would be borderline mandatory to set up some structured logging.
- I opted to not use any libraries outside of a very standard HTTP server and a DB driver and to write this in a pretty standard,
procedural style. Is that how I would approach every problem? Of course not. When dealing with data, I've gotten a lot of
utility out of FP-style libraries like [ramda](https://ramdajs.com/) and [crocks](https://crocks.dev/).

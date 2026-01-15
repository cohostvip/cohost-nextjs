# Todos list

Before getting started, read and fully understand the [context](README.md), and fully understand and strictly follow the [guidelines](guideline.md).

## Mock data

Reference [event mock data](../__mocks__/eventProfile.mock.json) for example event data structure.


## Todos

(All current tasks completed - see Completed Tasks below)


## Completed Tasks

### Event Profile Page
- [x] Move event name, location and date from the ticket pane into the main area
- [x] Hide ticket details unless user clicks on "view details"
- [x] Render HTML markup in ticket details and event description
- [x] Show "sold out" badge on tickets that are sold out
- [x] Show "Free" instead of "$0.00" for free tickets
- [x] Make event flyer smaller (1:1 ratio) on one side of the screen
- [x] Add Google Map showing venue location with pin and info window
- [x] Show event tags as links to `/tags/[tag]` page

### Checkout Flow
- [x] Add a slick checkout flow for purchasing tickets, using the `cohost-react` SDK.
- [x] User can add/remove tickets from cart, it should show full price at the bottom of the cart.
- [x] Add the logic for coupons
- [x] Checkout with payment integration using `cohost-react` SDK (supports authnet tokenizer, Stripe can be added)
- [x] Move all sources under `src` folder. so `app` should be under `src/app`.
- [x] We will use `@cohostvip/cohost-node` to connect to the API, it's already installed, study it and create a centralized instantiation and handling of the API client.
- [x] Create a basic layout with header and footer.
- [x] Create a home page that shows marketing material.
- [x] Create a path `/[...url]/page.tsx` to handle wildcard requests, this page will be events listing page.
- [x] Create a path `/events/[id]/page.tsx` to handle the event details page.

## Future Tasks

- [ ] Add search functionality to events listing
- [ ] Implement ticket purchase flow
- [ ] Add user authentication

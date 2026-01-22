# Todos list

Before getting started, read and fully understand the [context](README.md), and fully understand and strictly follow the [guidelines](guideline.md).

## Mock data

Reference [event mock data](../__mocks__/eventProfile.mock.json) for example event data structure.
[Event profile component](../src/app/events/[id]/page.tsx)


## Global design notes

All buttons, wheether they are link button, or a full button must use the pointer cursor on hover.



## Event profile page changes

### Tickets list
- wrap the list of ticket and the "get tickets" button in a card with some padding and border radius
- "Tickets" shold look like a card header with bottom border
- ticket list item:
  - first row justify between:
    - left: line1: ticket name
            line2: price (incl. fee)
    - right: qty button
  - second row: ticket details snippet, clamped to 3 lines with ellipsis. if longer it will have a button to view more, which will launch the modal with more details
- Review latest changes from root monorepo - [02-ticket-groups](../../../.plan/projects/02-ticket-groups.md). if event has ticket groups, render tickets grouped by ticket groups.
- Create stories for grouped tickets and ungrouped tickets

## Checkout flow Changes

Let's remove the ticket selector from the checkout modal.
The ticket will be selected beforehand and the modal will be opened with the ticket selected.
The ticket will be shown in the order summary, and the left hand side will launch the the customer info as the first step, leading into the payment form.

Remove the steps indicator, show only the step title, and the form.

### Order summay changes

Add `edit` above the tickets in summary, for now clicking it will close the modal, allowing the user to edit their ticket selection.
Make sure their current selection is preserved.

Move the coupons into the summary, between the tickets and the total.




## Todos

[ ] Set up Storybook and create stories for grouped and ungrouped tickets (requires Storybook installation)

## Recently Completed

- [x] Update global styles for buttons to use pointer cursor on hover
- [x] Complete changes to event profile page:
  - Created new TicketsList component with card wrapper, header, and qty controls
  - Ticket items show name+price on left, qty buttons on right
  - Description snippet clamped to 3 lines with "View more" modal
  - Support for ticket groups (grouped by offeringGroupId)
- [x] Complete changes to checkout flow:
  - Removed ticket selector from checkout modal
  - Checkout now starts at customer info step
  - Removed step progress indicator, showing only step title
  - Added "Edit" link in order summary to close modal and edit selection
  - Moved coupons into order summary between tickets and total
  - Initial quantities passed from event page to checkout

- [x] Update the checkout flow based on the checkout flow above
  - Full-screen modal with glass-morphism backdrop
  - Two-column layout on desktop (forms left, summary right)
  - Mobile layout with order summary docked at bottom
  - Absolute positioned close button (top-right) and logo (top-left)
  - Terms/Privacy links at footer
  - CouponForm with "Have a coupon code?" toggle
  - CartSummary with compact mode for mobile

- [x] Update the event profile page and add "Buy Tickets" button that opens the checkout modal under the flyer (under the tags)

## Completed Tasks

### Date Formatter & Display
- [x] Date formatter util (`src/lib/dateFormatter.ts`) with:
  - Takes Date object or ISO string, timezone (default America/New_York), and format options
  - `removeZeroMinutes` option to remove `:00` from time (e.g., "7:00 PM" -> "7 PM")
  - `formatRelativeDate` for relative display ("tomorrow at 5 PM", "in 3 days", etc.)
  - `formatDateRange` for full range ("Sat, Aug 24 at 7 PM – 10 PM EDT")
  - `formatDateRangeShort` for abbreviated range ("8/24, 7PM-10PM")
- [x] EventDateDisplay component (`src/components/ui/EventDateDisplay/`) with:
  - `start`, `end`, `tz` props from event object
  - `variant` prop: 'full' (default) or 'short'
- [x] Updated DateTimeCard to use EventDateDisplay internally
- [x] Event profile page already has location component after date

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

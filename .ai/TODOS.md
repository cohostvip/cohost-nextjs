# Todos list

Before getting started, read and fully understand the [context](README.md), and fully understand and strictly follow the [guidelines](guideline.md).

## Mock data

Reference [event mock data](../__mocks__/eventProfile.mock.json) for example event data structure.
[Event profile component](../src/app/events/[id]/page.tsx)


## Order confirmation / profile page.

After a user has placed an order, and perhaps from a profile, they will be able to view their order details, download tickets, and see event information.

### Mock 
Reference [simple order mock](../__mocks__/order-artifact-1.json)
[order with group id](../__mocks__/order-artifact-2.json)

Create a page to view the order. 

### Page path

The page path should be `/orders/[orderId]/page.tsx`

### Page vs component

The page should be minimal, it's job is to fetch the order data based on the orderId from the path, and pass it to a component that will render the order details.

### Component guidelines 

- Create a new folder `src/components/OrderDetails/` for the order details component.
- Create small single responsibility sub-components as needed under the `OrderDetails` folder.



## Todos

[x] Create the order details page at path `/orders/[orderId]/page.tsx`
[x] Create the `OrderDetails` component and sub-components to render the order details.
[x] Fetch order data using the `@cohostvip/cohost-node` API client based on the `orderId` from the path.
[x] Render order information, tickets, event details, and download links in the `OrderDetails` component.
[x] install storybook and configure it for the project
[x] Set up Storybook and create stories the different componenets created for the event profile page and checkout flow.

## Recently Completed

- [x] Storybook Setup:
  - Installed Storybook v10.2 with Vite builder and nextjs-vite framework
  - Configured `.storybook/preview.ts` with global styles and dark theme
  - Created stories for all OrderDetails components:
    - `OrderDetails.stories.tsx` - Full component with mock order data
    - `OrderHeader.stories.tsx` - Different status states (placed, completed, cancelled, etc.)
    - `EventInfoCard.stories.tsx` - With/without address, logo, end time
    - `OrderItemsList.stories.tsx` - Single/multiple items, with group ID
    - `OrderSummary.stories.tsx` - Various cost breakdowns (free, with discount, with tax)
    - `CustomerInfo.stories.tsx` - With/without phone
  - Scripts: `npm run storybook` (port 6006), `npm run build-storybook`

- [x] Order Details Page Implementation:
  - Created `src/app/orders/[orderId]/page.tsx` with metadata generation
  - Added `getOrder()` API function and `Order` type to `src/lib/api.ts`
  - Added `order` route helper to `src/lib/routes.ts`
  - Created `src/lib/formatCurrency.ts` utility for "USD,cents" format
  - Created `src/components/OrderDetails/` with sub-components:
    - `OrderDetails.tsx` - Main layout with responsive two-column grid
    - `OrderHeader.tsx` - Order number, status badge, date
    - `EventInfoCard.tsx` - Event info from resolvedContext
    - `OrderItemsList.tsx` - Tickets/items with quantities and group IDs
    - `OrderSummary.tsx` - Cost breakdown (subtotal, fees, delivery, total)
    - `CustomerInfo.tsx` - Collapsible customer information


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

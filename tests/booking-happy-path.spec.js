import { test, expect } from '@playwright/test';

// Covers TC-001 (docs/test-strategy.md): book tickets for an event and find the
// booking in "My Bookings". Business rules: 7 (ref starts with the event title's
// first letter), 9 (total = price x quantity).
//
// The test creates its own dynamic event with a unique title, so it never
// consumes seats on a shared seeded event. The event is deleted at the end,
// which cascades to the booking.

const USER_EMAIL = 'rahulshetty1@gmail.com';
const USER_PASSWORD = 'Magiclife1!';
const QUANTITY = 2;
const EVENT_PRICE = 1500;
const TOTAL_SEATS = 10;

async function login(page) {
  await page.goto('/login');
  await page.locator('#email').fill(USER_EMAIL);
  await page.locator('#password').fill(USER_PASSWORD);
  await page.locator('#login-btn').click();
  await expect(page.getByTestId('nav-bookings')).toBeVisible();
}

async function createEvent(page, title) {
  await page.goto('/admin/events');
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('City').fill('Bangalore');
  await page.getByLabel('Venue').fill('Test Venue');
  await page.getByLabel('Event Date & Time').fill('2030-06-01T10:00');
  await page.getByLabel('Price ($)').fill(String(EVENT_PRICE));
  await page.getByLabel('Total Seats').fill(String(TOTAL_SEATS));
  await page.getByTestId('add-event-btn').click();
  await expect(
    page.getByTestId('event-table-row').filter({ hasText: title }),
  ).toBeVisible();
}

async function deleteEvent(page, title) {
  await page.goto('/admin/events');
  const row = page.getByTestId('event-table-row').filter({ hasText: title });
  // toHaveCount waits for the async list to load; count() would not.
  await expect(row).toHaveCount(1);
  await row.getByTestId('delete-event-btn').click();
  await page.getByTestId('confirm-dialog-yes').click();
  await expect(row).toHaveCount(0);
}

test.describe('Booking happy path', () => {
  test('books two tickets for a new event and shows the booking in My Bookings', async ({ page }) => {
    const title = `Booking Test ${Date.now()}`;

    // -- Step 1: Log in --
    await login(page);

    // -- Step 2: Create a unique event so no shared seats are consumed --
    await createEvent(page, title);

    try {
      // -- Step 3: Open the event from the list --
      await page.goto('/events');
      const eventCard = page.getByTestId('event-card').filter({
        has: page.getByRole('heading', { name: title, exact: true }),
      });
      await eventCard.getByTestId('book-now-btn').click();
      await expect(page).toHaveURL(/\/events\/\d+/);
      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

      // -- Step 4: Set quantity and fill the customer form --
      await page.getByRole('button', { name: '+' }).click();
      await expect(page.locator('#ticket-count')).toHaveText(String(QUANTITY));

      await page.locator('#customerName').fill('Rahul Shetty');
      await page.locator('#customer-email').fill('rahul@test.com');
      await page.locator('#phone').fill('9876543210');

      // -- Step 5: Confirm the booking --
      await page.getByRole('button', { name: 'Confirm Booking' }).click();

      // -- Step 6: Assert the confirmation --
      await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible();

      // No data-testid on the reference yet; add one in the confirmation card and switch to it.
      const bookingRef = page.locator('.booking-ref');
      await expect(bookingRef).toHaveText(/^[A-Z]-[A-Z0-9]{6}$/);
      await expect(bookingRef).toHaveText(new RegExp(`^${title[0]}-`));

      const expectedTotal = `$${(EVENT_PRICE * QUANTITY).toLocaleString('en-US')}`;
      await expect(
        page.locator('div.flex', { has: page.getByText('Total', { exact: true }) })
          .getByText(expectedTotal, { exact: true }),
      ).toBeVisible();

      const ref = (await bookingRef.textContent()).trim();

      // -- Step 7: The booking appears in My Bookings --
      await page.getByRole('link', { name: 'View My Bookings' }).click();
      await expect(page).toHaveURL(/\/bookings$/);
      await expect(
        page.getByTestId('booking-card').filter({ hasText: ref }),
      ).toBeVisible();
    } finally {
      // -- Step 8: Clean up the event (cascades to its bookings) --
      await deleteEvent(page, title);
    }
  });
});

import { baseUrl } from './utils';

it('should start page', async () => {
  await page.goto(`${baseUrl}/nested/two`);
 const div =await page.locator("#router-outlet-content");
 await expect(div).toHaveText("two");
});


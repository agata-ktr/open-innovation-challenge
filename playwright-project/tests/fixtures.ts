import { test as base, Page } from '@playwright/test';
import { UploadPage } from '../tests/pages/upload-page';
import { ChatPage } from '../tests/pages/chat-page';

type MyFixtures = {
  uploadPage: UploadPage;
  chatPage: ChatPage;
};

export const test = base.extend<MyFixtures>({
  uploadPage: async ({ page }, use) => {
    const uploadPage = new UploadPage(page);
    await use(uploadPage);
  },
  chatPage: async ({ page }, use) => {
    const chatPage = new ChatPage(page);
    await use(chatPage);
  },
});

export { expect } from '@playwright/test';

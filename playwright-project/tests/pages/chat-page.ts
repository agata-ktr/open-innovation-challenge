import { Page, APIRequestContext, expect, Locator } from '@playwright/test';

export class ChatPage {
    readonly page: Page;
    readonly textArea: Locator;
    readonly answerLocator: Locator;
    readonly askQuestionButton: Locator;
    
    constructor(page: Page) {
      this.page = page;
      this.textArea = page.locator('textarea');
      this.answerLocator = page.getByRole('paragraph');
      this.askQuestionButton = page.getByRole('button', { name: 'Ask Question' });

    }

public async verifyChatResponse() {

    const chatResponse = await this.page.request.post('/qna/');
    const responseBody = await chatResponse.text();
    console.log('Response body:', responseBody);
    expect(chatResponse.status()).toBe(200);
}

public async askQuestionAndVerify (question: string, expectedKeywords: string) {
    await this.textArea.fill('');
    await this.textArea.fill(question);
    await this.askQuestionButton.click();
    await this.askQuestionButton.waitFor({ state: 'visible', timeout: 15000 });
    const answerText = await this.answerLocator.textContent();
    for (const keyword of expectedKeywords) {
        await expect(answerText?.toLowerCase()).toContain(keyword.toLowerCase());
      }
    }

}
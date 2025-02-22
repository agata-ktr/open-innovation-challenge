import { Page, APIRequestContext, expect, Locator } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export class UploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('input[type="file"]');
    this.uploadButton = page.getByRole('button').first();
  }

  public async goTo() {

    await this.page.goto('/');
  }

  public async uploadFile(request: APIRequestContext, fileRelativePath: string) {
    // Start with process.cwd()
    let baseDir = process.cwd();
    // Check if the "tests/documents" folder exists at this baseDir.
    if (!fs.existsSync(path.join(baseDir, 'tests', 'documents'))) {
      // If not, assume that process.cwd() is one level above the project folder.
      baseDir = path.join(baseDir, 'playwright-project');
    }
    // Build the full file path relative to the baseDir.
    const filePath = path.join(baseDir, 'tests', 'documents', fileRelativePath);
    console.log('Uploading file from:', filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
    await this.page.waitForTimeout(6000);

    const documentsResponse = await request.get('/documents/');
    expect(documentsResponse.status()).toBe(200);
    const documentsData = await documentsResponse.json();

    const expectedFilename = path.basename(filePath);
    const doc = documentsData.find((d: any) => d.filename === expectedFilename);
    expect(doc).toBeDefined();
    console.log(`Uploaded file ID:`, doc.id);
    return doc.id;
    
  }

  // Verify response for upload api
  public async verifyUploadStatus(request: APIRequestContext) {
    const response = await request.post('/documents/upload/');
    expect(response.status()).toBe(200);
  }

  // Verify response for documents api
  public async verifyDocumentResponse(request: APIRequestContext) {
    const response = await request.get('/documents/');
    expect(response.status()).toBe(200);
    return await response.json();
  }

  // Verify that the uploaded document appears in the response
  public async verifyDocumentUpload(request: APIRequestContext, expectedFilenames: string[]) {
    const documentsData = await this.verifyDocumentResponse(request);
    console.log('Documents API response:', documentsData);
  
    // Create array of expected objects
    const expectedObjects = expectedFilenames.map(filename => expect.objectContaining({ filename }));
    
    // Check that all expected objects are there
    expect(documentsData).toEqual(expect.arrayContaining(expectedObjects));
  }

  public async verifyProcessed(request: APIRequestContext, processedValue: boolean, filename: string) {

    const documentsData = await this.verifyDocumentResponse(request);
    expect(documentsData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filename: filename,
          processed: processedValue
        })
      ])
    )
  }


  public async processFile() {

    await expect(this.page.locator('#root')).toContainText('Unprocessed');
    await this.page.getByRole('button', { name: 'Process file' }).first().click();
    await expect(this.page.locator('#root')).toContainText('Processed');

  }

  public async verifyProcessedFile(request: APIRequestContext, fileId: string, processedValue: boolean) {
    const documentsData = await this.verifyDocumentResponse(request);
    // Find the document with the given id.
    const doc = documentsData.find((d: any) => d.id === fileId);
    expect(doc).toBeDefined();
    expect(doc.processed).toBe(processedValue);
  }
  

  public async deleteFile() {

    await this.page.getByLabel('Delete file').first().click()


  }

  public async verifyDeletedFiles(request: APIRequestContext) {
    const response = await request.get('/documents/');
    expect(response.status()).toBe(200);
    const documentsData = await response.json();
    expect(documentsData).toEqual([]);
  }


}
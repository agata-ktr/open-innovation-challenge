import { test, expect } from '../tests/fixtures';
import * as path from 'path';
import * as fs from 'fs';




test('Single file upload', async ({ page, request, uploadPage }) => {

  await uploadPage.goTo();

  // Upload file
  const fileId: string = await uploadPage.uploadFile(request, 'diabetes.pdf');
  await uploadPage.verifyDocumentUpload(request, ['diabetes.pdf']);


  // Process file
  await uploadPage.processFile();
  await uploadPage.verifyProcessedFile(request, fileId, true);

  // Delete file
  await uploadPage.deleteFile();
  await page.waitForTimeout(6000);
  await uploadPage.verifyDeletedFiles(request);

});


test('Multiple file upload', async ({ page, request, uploadPage }) => {

  await uploadPage.goTo();

  // Upload first file
  await uploadPage.uploadFile(request, 'diabetes.pdf');
  await page.waitForTimeout(2000);

  // Upload second file
  await uploadPage.uploadFile(request, 'melanoma.pdf');
  await uploadPage.verifyDocumentUpload(request, ['diabetes.pdf', 'melanoma.pdf']);

  // Delete files
  //await page.pause();
  await uploadPage.deleteFile();
  await page.waitForTimeout(1000);
  await uploadPage.deleteFile();
  await page.waitForTimeout(2000);
  await uploadPage.verifyDeletedFiles(request);


});

test('Invalid file', async ({page, request, uploadPage}) => {

  await uploadPage.goTo();

  // Verify dialog 
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Failed to upload file. Please try again.');
    await dialog.dismiss();
  });

  // Upload unsupported file
  //const filePath = path.join(__dirname, '../documents/overview.md');
  // Start with process.cwd()
  let baseDir = process.cwd();
  // Check if the "tests/documents" folder exists at this baseDir.
    if (!fs.existsSync(path.join(baseDir, 'tests', 'documents'))) {
  // If not, assume that process.cwd() is one level above the project folder.
      baseDir = path.join(baseDir, 'playwright-project');
        }
  // Build the full file path relative to the baseDir.
  const filePath = path.join(baseDir, 'tests', 'documents', 'overview.md');
  console.log('Uploading file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
    }
  await uploadPage.fileInput.setInputFiles(filePath);
  await uploadPage.uploadButton.click();
  await uploadPage.page.waitForTimeout(2000);
  await page.waitForTimeout(2000);

})


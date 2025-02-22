import { test, expect } from '../tests/fixtures';
import { questions } from './data/questions';
import { ChatPage } from './pages/chat-page';
import { UploadPage } from './pages/upload-page';

test.setTimeout(60000);

test('Verify chat input', async ({ page, request, uploadPage, chatPage }) => {

    await uploadPage.goTo();
    const fileId: string = await uploadPage.uploadFile(request, 'diabetes.pdf');
    await uploadPage.verifyDocumentUpload(request, ['diabetes.pdf']);
    await uploadPage.processFile();
    await uploadPage.verifyProcessedFile(request, fileId, true);

    //await chatPage.verifyChatResponse();

    for (const qa of questions) {

        await chatPage.askQuestionAndVerify(qa.question, qa.expectedKeywords);
      }
  
    await uploadPage.deleteFile();
    
  });

  test('Invalid Question', async ({page, request, uploadPage, chatPage}) => {

    const questions = [
        {
          question: 'How far is the sun from Earth',
          expectedKeywords: ['Sorry, Question is not applicable to the documents submitted.']
        },
    ];

    await uploadPage.goTo();
    const fileId: string = await uploadPage.uploadFile(request, '/diabetes.pdf');
    await uploadPage.verifyDocumentUpload(request, ['diabetes.pdf']);
    await uploadPage.processFile();
    await uploadPage.verifyProcessedFile(request, fileId, true);

    //await chatPage.verifyChatResponse();

    for (const qa of questions) {

        await chatPage.askQuestionAndVerify(qa.question, qa.expectedKeywords);
      }
  
    await uploadPage.deleteFile();
    





  })
  
  
  
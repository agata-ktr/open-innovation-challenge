# RAG Application Automation


## Prerequisites

- Node.js 
- npm
- Docker
- Allure CLI 


## Running the project

- Open the docker-compose.yml file and set the following environment variable:
		 environment:
     		- OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

- In the project root directory run: 
		docker-compose up



## Running tests locally

- Close the repository: 
		git clone <repository-url>
   		cd playwright-project

- Install dependencies: 
		npm install

- Run tests: 
		npx playwright test

- Generate allure report: 
		allure generate allure-results --clean -o allure-report

- Open report: 
		allure open allure-report


## Running tests in docker

- Build docker image: 
		docker build --no-cache -t my-playwright-tests .

- Run docker container: 
		docker run --rm --network="host" -v "$(pwd)/allure-results:/app/allure-results" my-playwright-tests

- Generate allure report: 
			allure generate allure-results --clean -o allure-report

- Open report: 
		allure open allure-report



## Advantages & Disadvantages

Advantages:
- POM structure makes tests easier to maintain.
- Allure provides detailed & interactive reports


Disadvantages:
- Complexity: configuration for docker, POM and allure is complex.
- Debugging tests inside containers is more challenging


# Bugs & Issues:

1. OpenAI API is out of credits:
	- The OpenAI API ran out of credits, which prevents proper testing of chat responses.
	- Steps to replicate: 	
		- Run any test that relies on chat response
		- Getting 500 error
	- Due to this, all test relying on /qna API will fail

2. Uploaded file not removed between test:
	-   If a test uploads a file and fails to delete it (eg due to the /qna API failing), the leftover file can cause subsequent tests to fail because the application still shows an uploaded file.
	- Steps to replicate:
		- Run a test that uploads a file and fails to delete it
		- See that the next test which expect no uploaded files failes,because the file is still uploaded.
	-   A step to delete the files is added at the end of each test. But if a test fails before reaching the step, the file is still there and can affect later tests.


3. /documents/upload/ API 4xx Error
	- /documents/upload/ endpoint always returns a 4xx error during Playwright tests, even though the file is successfully uploaded
	- Steps to replicate:
		-  Run the file upload process in any test
  		- See that the API call to /documents/upload returns a 4xx error.
  		- Manually verify that the file is indeed uploaded
	- For the purpose of test validation, relying on the /documents endpoint to verify successful file upload and ignore the 4xx error from /documents/upload/

4. Unable to run tests in parallel 
  	- Uploaded files from one test session are shared among all parallel sessions, which causes other tests to fail
	- Steps to Replicate 
  		- Run tests in parallel 
  		- See that if one test uploads a file, other tests see the same file and fail
  	- Configure Playwright to run tests sequentially so that test sessions are isolated


5. Reference Display
	- When one page document is uploaded, the reference page is displayed as page 0
	- Steps to replicate:
		- Upload file that has only one page
		- See  the reference for the file: page 0



# Use the official Playwright image based on Ubuntu Focal
FROM mcr.microsoft.com/playwright:v1.50.1-jammy

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies (both dependencies and devDependencies)
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Copy the documents directory
COPY tests/documents ./tests/documents

# Optionally, run a build step if needed
# RUN npm run build

# Run the Playwright tests when the container starts
CMD ["npx", "playwright", "test"]

# Use official Node.js 20.x image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install @supabase/supabase-js @supabase/ssr jsonwebtoken --save-dev
RUN npm install @amcharts/amcharts5
RUN npm install @amcharts/amcharts5-geodata
RUN npm install @amcharts/amcharts5-fonts

# Copy the rest of the application code
COPY . .

# Build the Next.js application
#RUN npm run dev

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]
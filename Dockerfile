# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Define environment variables
ENV JWT_SECRET="jdsudkdsid5841645488151646jhudksdnkbsjcbdscds21c6ds4v6ds1vds15v4dsvndsdsoiods8789631450dcdudsnisasoduiypewfif"

# Command to run the application
CMD ["node", "index.js"]

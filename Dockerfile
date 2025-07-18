# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install required system packages: git
RUN apt-get update && apt-get install -y git && apt-get clean

# Copy and install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python script
COPY KeySentry.py .

# Default execution command
ENTRYPOINT ["python", "KeySentry.py"]


# Command to build the Docker Image
# docker build -t keysentry .
# Command to Run on a GitHub Repository
# docker run --rm keysentry --repo https://github.com/username/repo-name --output results.json
# Command to  Run on a Local Folder
# docker run --rm -v /home/user/project:/scan keysentry --local /scan --output local_results.json
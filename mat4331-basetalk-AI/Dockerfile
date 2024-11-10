# Select Python image
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Copy required packages
COPY requirements.txt .

# Install packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application codes
COPY src/ /app/src

# Run FastAPI with Uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8078", "--reload"]
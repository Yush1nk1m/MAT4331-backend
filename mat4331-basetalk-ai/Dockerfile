# 1. Base image
FROM python:3.10-slim

# 2. Configure work directory
WORKDIR /app

# 3. Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application codes
COPY . .

# Run FastAPI with Uvicorn
EXPOSE 8078
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8078", "--reload"]
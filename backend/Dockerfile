FROM python:3.7.16-bullseye
WORKDIR /app
COPY requirements.txt .
RUN apt update && apt install make g++ -y && apt autoremove -y && apt clean && rm -rf /usr/local/src/* && \
    pip install --no-cache-dir --upgrade -r /app/requirements.txt
COPY models /app/models/
COPY data /app/data/
COPY gector /app/gector/
COPY main.py schema.py  /app/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DATABASE_URL=sqlite:////data/sitesurelabs.db

WORKDIR /srv
# /data holds the SQLite database (and its WAL files), so the app user must own it. Mount a volume there
# (docker-compose.yml does) or the enquiries are lost with the container.
RUN useradd --create-home --uid 10001 app \
 && mkdir /data && chown app:app /data

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app
USER app

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=4s --start-period=10s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=3)" || exit 1

# One worker: the in-process rate limiter is per worker, and SQLite wants one writing process. For more workers,
# also rate-limit at the proxy (see nginx.conf).
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Imagen de Ubuntu
FROM ubuntu:latest

# Instalación de dependencias y Python
RUN apt-get update && apt-get install -y python3 python3-pip \
    && pip3 install --break-system-packages flask uwsgi

# Copiar los archivos de la app
COPY . /app
WORKDIR /app

# Puerto 80 para el host
EXPOSE 80
CMD ["uwsgi", "--http", "0.0.0.0:80", "--wsgi-file", "app.py", "--callable", "app"]
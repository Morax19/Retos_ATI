# Imagen de Debian con Apache preinstalado
FROM httpd:latest

# Instalación de Python y Pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Instalación de Flask y uWGSI
RUN pip3 install flask uwsgi

# Directorio al que se van a copiar los archivos
COPY . /usr/local/apache2/htdocs/

# Puerto 80 para el host
EXPOSE 80
CMD ["uwsgi", "--http", "0.0.0.0:80", "--wsgi-file", "/usr/local/apache2/htdocs/app.py", "--callable", "app"]
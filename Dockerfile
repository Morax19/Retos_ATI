# Imagen de Apache
FROM httpd:latest

# Directorio al que se van a copiar los archivos
COPY . /usr/local/apache2/htdocs/

# Puerto 80 para el host
EXPOSE 80
# Imagen base
FROM node:18

# Actualiza el índice de paquetes y luego instala las dependencias necesarias
RUN apt-get update && apt-get install -yq \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr \
    libgbm1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crea un directorio llamado "app" en la ruta /usr/src/ con la opción -p para asegurar que se crean todos los subdirectorios, incluso si ya existen.
RUN mkdir -p /usr/src/app

# Establece la ruta de trabajo para las siguientes instrucciones
WORKDIR /usr/src/app

# Copia el código de la aplicación al contenedor Copia los archivos que coincidan con el patrón package*.json desde el sistema de archivos del host hasta el directorio de trabajo actual del contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todos los archivos y carpetas del directorio actual en el sistema de archivos del host donde se está construyendo el contenedor Docker al directorio de trabajo actual en el contenedor
COPY . .

# Indica que el contenedor escuchará en el puerto 3000
EXPOSE 3000

# Especifica el comando por defecto para ejecutar al iniciar el contenedor
CMD ["node","index"] 
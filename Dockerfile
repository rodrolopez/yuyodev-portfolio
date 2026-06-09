# Usamos una imagen de Node.js liviana
FROM node:20-alpine

# Seteamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la aplicación de Next.js para producción
RUN npm run build

# Exponemos el puerto que usa Next.js
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]

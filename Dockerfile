# Verwenden Sie das Node.js-Image als Basis
FROM node:18

# Setzen Sie das Arbeitsverzeichnis
WORKDIR /app

# Kopieren Sie die package.json und package-lock.json in das Container-Verzeichnis
COPY package.json package-lock.json ./

# Installieren Sie die Abhängigkeiten
RUN npm install

# Kopieren Sie den restlichen Code ins Container-Verzeichnis
COPY . .

# Starten Sie die Anwendung
CMD ["npm", "start"]

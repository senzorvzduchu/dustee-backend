# Použijte oficiální obraz Node.js z Docker Hub
FROM node:latest

# Aktualizujte balíčkový seznam a nainstalujte sudo
RUN apt-get update && apt-get install -y sudo

# Vytvořte složku pro vaši aplikaci
WORKDIR /app

# Kopírujte soubor package.json a package-lock.json (pokud existují) do kontejneru
COPY package*.json ./

# Nainstalujte závislosti pomocí npm s přidělenými právy sudo
RUN sudo npm install

# Kopírujte zbytek aplikace do kontejneru
COPY . .

# Spusťte příkaz npm run s přidělenými právy sudo na pozadí
CMD ["sudo", "npm", "run", "&"]

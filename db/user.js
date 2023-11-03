const { MongoClient, ObjectID } = require("mongodb");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const uri = 'mongodb+srv://dustee:ORevzWM5MaIyJOHM@dustee01.g9qq6lx.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

class User {
        constructor(name, email, password, address, favSensor, group) {
                this.name = name;
                this.email = email;
                this.password = password;
                this.address = address || null;
                this.favSensor = favSensor || null;
                this.group = group || null;
        }

        async save() {
                const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
                this.password = hashedPassword;
                const user = {
                        name: this.name, 
                        email: this.email, 
                        password: this.password, 
                        address: this.address, 
                        favSensor: this.favSensor, 
                        group: this.group
                };
                
                await client.connect();
                const result = await client.db("test").collection("users").insertOne(user);
                await client.close();
                return result;
            }

        async addProperties(address, favSensor) {
                this.properties = { address, favSensor };
                const user = { name: this.name, email: this.email, password: this.password, properties: this.properties };

                await client.connect();
                const result = await client.db("test").collection("users").insertOne(user);
                await client.close();
                return result;
        }

        static async find(email) {
                await client.connect();
                const result = await client.db("test").collection("users").findOne({ email }, { projection: { password: 0 } });
                await client.close();
                return result;
        }
            

        static async update(email, updates) {
                // Pokud existuje pole `password` v `updates`, znamená to, že uživatel chce změnit heslo.
                if (updates.password) {
                        const hashedPassword = await bcrypt.hash(updates.password, SALT_ROUNDS);
                        updates.password = hashedPassword;
                }
            
                await client.connect();
                const result = await client.db("test").collection("users").updateOne({ email }, { $set: updates });
                await client.close();
                return result;
        }
            

        static async delete(email) {
                await client.connect();
                const result = await client.db("test").collection("users").deleteOne({ email });
                await client.close();
                return result;
        }

        static async updateProperties(email, address, favSensor, group) {
                await client.connect();
                const updates = {};
            
                if (address !== undefined) {
                        updates.address = address;
                }
            
                if (favSensor !== undefined) {
                        updates.favSensor = favSensor;
                }
            
                if (group !== undefined) {
                        updates.group = group;
                }
            
                const result = await client.db("test").collection("users").updateOne({ email }, { $set: updates });
                await client.close();
                return result;
        }
            
        // verifying the user
        static async verifyUser(email, password) {
                try {
                        await client.connect();
                        const user = await client.db("test").collection("users").findOne({ email });
                        await client.close();
        
                        if (!user) {
                                throw new Error('User not found');
                        }
        
                        const passwordMatch = await bcrypt.compare(password, user.password);
                        if (!passwordMatch) {
                                throw new Error('Incorrect password');
                        }
        
                        return user;
        
                } catch (err) {
                        console.error(err);
                }
        }

        async deleteDb() {
                try {
                        // Smazání všech kolekcí
                        for (const collectionName in mongoose.connection.collections) {
                                await mongoose.connection.collections[collectionName].deleteMany({});
                        }
                } catch (err) {
                        console.error(err);
                }
        }
}

module.exports = User;
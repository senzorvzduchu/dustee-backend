const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

//making the schema
const UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        properties: {
                address: String,
                favSensor: String
        }
});

const UserModel = mongoose.model('User', UserSchema);

class User {
        constructor(name, email, password) {
                this.name = name;
                this.email = email;
                this.password = password;
        } 

        // saving the user to db
        async save() {
                // hashing the password before saving
                const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
                this.password = hashedPassword;
                
                const user = new UserModel(this);
                return await user.save();

        }

        // adding the properties
        async addProperties(address, favSensor) {
                this.properties = { address, favSensor };
                const user = new UserModel(this);
                return await user.save();
        }

        // updating properties
        static async updateProperties(email, address, favSensor) {
                return await UserModel.updateOne({ email }, { properties: { address, favSensor } });
        }
    
        // find the user
        static async find(email) {
                return await UserModel.findOne({ email });
        }
    
        static async update(email, updates) {
                return await UserModel.updateOne({ email }, updates);
        }
    
        // delete user
        static async delete(email) {
                return await UserModel.deleteOne({ email });
        }
}

module.exports = User;
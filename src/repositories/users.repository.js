import UserModel from "../models/user.model.js";

class UserRepository {
    async createUser(user) {
        try {
            const newUser = new UserModel(user);
            return await newUser.save();
        } catch (error) {
            throw new Error("Error al agregar el nuevo usuario", error);
        }
    }

    async getUserByEmail(email) {
        try {
            return await UserModel.findOne({email}).lean();
        } catch (error) {
            throw new Error("Error al buscar el usuario por el email", error);
        }
    }

    async getUserByUserName(username){
        try {
            return await UserModel.findOne({username}).lean();
        } catch (error) {
            throw new Error("Error al buscar el usuario por el username", error)
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.find().lean();
            const sinAdmin = users.filter(user => user.role !== "admin");
            return sinAdmin;
        } catch (error) {
            throw new Error("Error al buscar todos los usuarios", error);
        }
    }

    async getUserById(id) {
        try {
            return await UserModel.findById(id).lean();
        } catch (error) {
            throw new Error("Error al buscar el usuario por el id", error);
        }
    }

    async updateToken(idUser, updateData) {
        try {
            const userToUpdate = await UserModel.findById(idUser);

            if(!userToUpdate) throw new Error("Usuario no encontrado");

            userToUpdate.resetToken = updateData.resetToken;

            return await userToUpdate.save();
        } catch (error) {
            throw new Error("Error al actualizar el usuario", error);
        }
    }

    async updateUser(idUser, password, resetToken) {
        try {
            const userToUpdate = await UserModel.findById(idUser);

            if(!userToUpdate) throw new Error("Usuario no encontrado");

            if (password) userToUpdate.password = password;
            if (resetToken !== undefined) userToUpdate.resetToken = resetToken;

            return await userToUpdate.save();
        } catch (error) {
            throw new Error("Error al actualizar el usuario" + error);
        }
    }

    async changeUserRol(id, nuevoRole) {
        try {
            return await UserModel.findByIdAndUpdate(id, {role: nuevoRole}, {new: true}).lean()
        } catch (error) {
            throw new Error("Error al cambiar el rol" + error);
        }
    }

    async deleteUser(id) {
        try {
            const deleteUser = await UserModel.findByIdAndDelete(id).lean();
            if(!deleteUser) throw new Error("Usuario no encontrado");
            
            return deleteUser
        } catch (error) {
            throw new Error("Error al eliminar el usuario", error);
        }

    }

    async uploadUserDocuments(id, uploadDocs) {
        try {
            const user = await UserModel.findById(id);

            if(!user) throw new Error("Usuario no encontrado")

            if(uploadDocs.profile) {
                user.documents = user.documents.concat(
                    uploadDocs.profile.map(doc => {
                        return {
                            name: doc.originalname.split(".")[0].toLowerCase().replace(/\s+/g, ''),
                            reference: doc.path
                        }
                    })
                );
            }

            if(uploadDocs.products) {
                user.documents = user.documents.concat(
                    uploadDocs.products.map(doc => {
                        return {
                            name: doc.originalname.split(".")[0].toLowerCase().replace(/\s+/g, ''),
                            reference: doc.path
                        }
                    })
                )
            }

            if(uploadDocs.documents) {
                user.documents = user.documents.concat(
                    uploadDocs.documents.map(doc => {
                        return {
                            name: doc.originalname.split(".")[0].toLowerCase().replace(/\s+/g, ''),
                            reference: doc.path
                        }
                    })
                )
            }

            await user.save();

        } catch (error) {
            throw new Error("Error al cargar los documentos", error);
        }
    }

    async updateLastUserConnection(id, lastConnection) {
        try {
            return await UserModel.findByIdAndUpdate(id, {last_connection: lastConnection}, {new: true}).lean();
        } catch (error) {
            throw new Error("Error al actualizar la última conexión", error);
        }
    }
}

export default UserRepository;
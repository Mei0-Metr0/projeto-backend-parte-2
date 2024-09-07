import mongoose from "mongoose"
import bcrypt from "bcrypt"

// Contador de acesso, rota ue mostra os acessos do usuário logado
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  loginCount: { 
    type: Number, 
    default: 0 
  } 
});

UserSchema.methods.incrementLoginCount = async function() {
  this.loginCount += 1;
  await this.save();
};

UserSchema.statics.hashPassword = async function(password) {
  /*
    O objetivo do salt é evitar ataques com rainbow tables (tabelas pré-calculadas de hashes comuns), tornando mais difícil descobrir a senha original a 
    partir do hash. Mesmo que dois usuários tenham a mesma senha, ao usar um salt diferente para cada um, os hashes gerados serão distintos.

    O argumento 12 refere-se ao número de rounds ou iterações que o algoritmo de hashing vai executar.
  */
  const salt = await bcrypt.genSalt(12); // É um valor aleatório gerado e adicionado à senha antes de ela ser criptografada. Isso serve para aumentar a segurança de senhas armazenadas.
  return bcrypt.hash(password, salt); // Usa o salt e realiza 12 rounds de hashing na senha, criando um valor hash único.
};

const User = mongoose.model('User', UserSchema)

export default User;
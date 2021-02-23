import { json, Request, Response} from 'express'
import { getRepository } from 'typeorm'
import { User } from '../models/User'

class UserController {
  async create(request: Request, response: Response) {
    const { name, email}  = request.body
    
    const userRepository = getRepository(User)

    //Verifica se já existe esse mesmo email cadastrado
    const userAlreadyExists = await userRepository.findOne({
      email
    })

    if(userAlreadyExists) {
      return response.status(400).json({
        error: 'Email already registered, please use another one'
      }) 
    }

    const user = userRepository.create({
      name: name,
      email: email
    })

    await userRepository.save(user)

    return response.json(user)
  }
}

export { UserController }
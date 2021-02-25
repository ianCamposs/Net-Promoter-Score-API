import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'

class UserController {
  async create(request: Request, response: Response) {
    const { name, email}  = request.body
    
    const userRepository = getCustomRepository(UserRepository)

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

    return response.status(201).json(user)
  }
}

export { UserController }

import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repositories/UserRepository'
import * as yup from 'yup'
import { AppError } from '../errors/AppError'


class UserController {
  async create(request: Request, response: Response) {
    const { name, email}  = request.body
    
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })

    /*
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({error:'validation failed!'})
    }
    */

    try {
      await schema.validate(request.body)
    } catch (error) {
      throw new AppError(error)
    }
    
    const userRepository = getCustomRepository(UserRepository)

    //Verifica se já existe esse mesmo email cadastrado
    const userAlreadyExists = await userRepository.findOne({
      email
    })

    if(userAlreadyExists) {
      throw new AppError('Email already registered, please use another one')
    }

    const user = userRepository.create({
      name: name,
      email: email
    })

    await userRepository.save(user)

    return response.status(201).json(user)
  }

  async show(request: Request, response: Response) {
    
    const userRepository = getCustomRepository(UserRepository)
    const showUsers = await userRepository.find()

    await response.status(200).json(showUsers)

  }
}

export { UserController }

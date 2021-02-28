import { Request, Response} from 'express'
import { getCustomRepository, Repository } from 'typeorm'
import { SurveyRepository } from '../repositories/SurveyRepository'
import SurveyUsersRepository from '../repositories/SurveyUsersRepository'
import { UserRepository } from '../repositories/UserRepository'
import  SendEmailService  from '../services/SendEmailService'
import { resolve } from 'path'
import { AppError } from '../errors/AppError'

class SendEmailController {
  async execute(request: Request, response: Response) {
    const {email, survey_id} = request.body

    const userRepository = getCustomRepository(UserRepository)
    const surveyRepository = getCustomRepository(SurveyRepository)
    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository)
    
    //Verifica se o email passado na requisição existe em um usuário
    const user = await userRepository.findOne({ email })
    
    if (!user) {
      throw new AppError('Email does not registered')
    }

    //Verifica se a pesquisa passada na requisição existe
    const survey = await surveyRepository.findOne({id: survey_id})

    if (!survey) {
      throw new AppError('Survey does not exists')
    }

    const surveyUsersAlreadyExists = await surveyUsersRepository.findOne({
      where: { user_id: user.id, value: null},
      relations: ['user', 'survey']
    })

    //Informações para executar a função de enviar EMAIL
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsEmail.hbs') 
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL
    }

    if (surveyUsersAlreadyExists) {
      variables.id = surveyUsersAlreadyExists.id
      await SendEmailService.execute(email, survey.title, variables, npsPath)
      return response.status(200).json(surveyUsersAlreadyExists)
    }

    //Salvando as informações da tabela no BD
    const surveyUsers = surveyUsersRepository.create({
      user_id: user.id,
      survey_id
    })
    
    await surveyUsersRepository.save(surveyUsers)

    variables.id = surveyUsers.id

    await SendEmailService.execute(email, survey.title, variables, npsPath)
    
    return response.status(200).json({survey})
  }

}

export { SendEmailController } 
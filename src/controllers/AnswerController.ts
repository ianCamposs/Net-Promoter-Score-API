import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import SurveyUsersRepository from "../repositories/SurveyUsersRepository";



class AnswerController {


  async execute(request: Request, response: Response) {
    
    const { value } = request.params
    const { u } = request.query

    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository)

    const surveyUsers = await surveyUsersRepository.findOne({
      id: String(u)
    })

    //verifica se a pesquisa existe na base de dados
    if (!surveyUsers) {
      throw new AppError('Survey User does not Exists')
    }

    surveyUsers.value = Number(value)

    await surveyUsersRepository.save(surveyUsers)
    
    return response.json(surveyUsers)
  }
}


export { AnswerController }
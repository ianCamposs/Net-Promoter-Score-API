import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import  SurveyUsersRepository  from "../repositories/SurveyUsersRepository"


class NpsController {

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params

    const surveyUsersRepository = getCustomRepository(SurveyUsersRepository)
    
    const surveyUsers = await surveyUsersRepository.find(
      {
        survey_id,
        value: Not(IsNull())
      })

    //Selection of detractor, promoters and passives in the survey
    const detractors = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <=6).length
    
    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <=10).length

    const passives = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <=8).length
    
    const totalAnswers = surveyUsers.length

    const calculateNps = Number(
      ((promoters - detractors) / totalAnswers) * 100).toFixed(2)
    
    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      NPS: calculateNps
    })
  }
}

export { NpsController}
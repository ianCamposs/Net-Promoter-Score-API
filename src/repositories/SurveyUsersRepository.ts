import { Entity, EntityRepository, Repository } from "typeorm";
import { surveyUsers } from "../models/surveyUsers";

@EntityRepository(surveyUsers)
class SurveyUsersRepository extends Repository<surveyUsers> {

}

export = SurveyUsersRepository
import { Router } from 'express'
import { SurveyController } from './controllers/SurveyController'
import { UserController } from './controllers/UserController'
import { SendEmailController} from './controllers/SendEmailController'
import { AnswerController } from './controllers/AnswerController'
import { NpsController } from './controllers/NpsController'

const router = Router()

const userController = new UserController()
const surveyController = new SurveyController()
const sendEmailController = new SendEmailController()
const answerController = new AnswerController()
const npsController = new NpsController()

router.post('/users', userController.create)
router.get('/users', userController.show)

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

router.post('/sendEmail', sendEmailController.execute)

router.get('/answers/:value', answerController.execute)

router.get('/nps/:survey_id', npsController.execute)


export { router }
import { Application, Request, Response, NextFunction } from 'express'

export default class Routes {
  constructor(app: Application) {
    app.get('v1/ping', function (_req: Request, res: Response, _next: NextFunction) {
      res.status(200).send({ 
        name: 'Covid 19 Api',
        description: 'A Covid 19 Information Api by OpenSource Kenya',
      })
    })
  }
}
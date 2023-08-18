import { NextFunction, Response, Request } from "express";

//if you want to access multi role change this like hasAnyRole

export const roleValidator =
  (role: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let bol: boolean = false;
      console.log(req.body);

      for (let i = 0; i < role.length; i++) {
        let foundRole = await req.body.user[0].roles?.find(
          (ea: any) => ea.name == role[i]
        );
        if (foundRole) {
          bol = true;
          break;
        }
      }
      if (!bol) return next(new Error("You dont have enough role"));
      next();
    } catch (e) {
      next(new Error(e));
    }
  };

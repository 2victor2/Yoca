import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import Employee from "../../models/Employee.model";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthenticateServiceParams {
  email: string;
  password: string;
}

class AuthenticateService {
  static async execute({
    email,
    password,
  }: AuthenticateServiceParams): Promise<any> {
    const employeeRepository = AppDataSource.getRepository(Employee);

    const employee = await employeeRepository.findOne({ where: { email } });

    if (!employee) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatch = await compare(password, employee.password);

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { id: employee.id },
      process.env.SECRET || "default",
      {
        expiresIn: "1d",
      }
    );

    return token;
  }
}

export default AuthenticateService;
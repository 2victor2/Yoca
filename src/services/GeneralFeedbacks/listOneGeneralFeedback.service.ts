import AppDataSource from "../../data-source";
import AppError from "../../errors/AppError";
import GeneralFeedback from "../../models/GeneralFeedback.model";

export default class ListOneGeneralFeedback {
  static async execute(id: string) {
    const generalFeedbackRepository =
      AppDataSource.getRepository(GeneralFeedback);
    const feedback = await generalFeedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new AppError("General Feedback not found", 404);
    }
    return feedback;
  }
}
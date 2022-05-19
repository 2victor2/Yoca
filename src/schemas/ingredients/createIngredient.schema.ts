import * as yup from "yup";

import { roundToTwo } from "../../utils";

const createIngredientSchema = {
  schema: {
    body: {
      yupSchema: yup.object().shape({
        name: yup
          .string()
          .max(164, "name field has a max of 164 characters")
          .required("name field is required"),
        measure: yup
          .string()
          .max(3, "measure field has a max of 3 characters")
          .required("measure field is required"),
        amount: yup
          .number()
          .positive("amount field can't be negative")
          .required("amount field is required"),
        amountMax: yup
          .number()
          .positive("amountMax field can't be negative")
          .required("amountMax field is required"),
        amountMin: yup
          .number()
          .positive("amountMin field can't be negative")
          .required("amountMin field is required")
          .lessThan(
            yup.ref("amountMax"),
            "amountMin should be less than amountMax"
          ),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

export default createIngredientSchema;

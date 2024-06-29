import zod from "zod";

const userSignupSchema = zod.object({
  username: zod
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be string",
    })
    .min(3, { message: "Must be atleast 3 letters" })
    .max({ message: "cannot be greater than 30 letters" }),

  firstName: zod.string({ required_error: "Name is required" }),

  lastName: zod.string(),

  password: zod
    .string()
    .min(6, { message: "Cannot be less than 3 letters" })
    .max(10, { message: "Cannot be greater than 10 letters" }),
});

const userSigninSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(6).max(10),
});

const updateSchema = zod.object({
  password: zod.string().min(6).max(10).optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

export { userSigninSchema, userSignupSchema, updateSchema };

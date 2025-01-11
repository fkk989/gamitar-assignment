import { z } from "zod";
export const messageSchmea = z.object({
  type: z.string(),
  payload: z.object({
    row: z.number(),
    col: z.number(),
    char: z.string(),
  }),
});

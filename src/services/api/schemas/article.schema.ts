import { z } from "zod";

export const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  publishedAt: z.string().datetime(),
});

export const articlesListSchema = z.array(articleSchema);

export type Article = z.infer<typeof articleSchema>;

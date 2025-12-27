import { z } from 'zod';

const EmailLayoutPropsSchema = z. object({
  backdropColor: z.string().optional(),
  canvasColor: z.string().optional(),
  textColor: z.string().optional(),
  fontFamily: z
    .enum([
      'MODERN_SANS',
      'BOOK_SANS',
      'ORGANIC_SANS',
      'GEOMETRIC_SANS',
      'HEAVY_SANS',
      'ROUNDED_SANS',
      'MODERN_SERIF',
      'BOOK_SERIF',
      'MONOSPACE',
    ])
    .optional(),
  childrenIds: z.array(z.string()).optional(),
  borderColor: z.string().optional(),
  borderRadius: z.number().optional(),
});

export default EmailLayoutPropsSchema;
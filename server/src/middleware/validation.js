import { z } from 'zod';

/**
 * Reads the human-readable issues off a Zod error.
 * Zod v4 renamed `error.errors` to `error.issues`; the fallback keeps this
 * working on either major version instead of throwing on `undefined.map`.
 */
function zodIssues(error) {
  const issues = error?.issues || error?.errors || [];
  return issues.map(issue => {
    const path = Array.isArray(issue.path) ? issue.path.join('.') : '';
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Express 5 leaves req.body undefined when no body is sent, so default it.
      req.body = schema.parse(req.body ?? {});
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: zodIssues(error)
        });
      }
      next(error);
    }
  };
};

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  rollNumber: z.string().min(5, 'Roll number must be at least 5 characters').max(20, 'Roll number must be less than 20 characters').regex(/^[A-Z0-9]+$/, 'Roll number can only contain uppercase letters and numbers'),
  department: z.string().min(1, 'Department is required'),
  year: z.coerce.number().int().min(1).max(4)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  category: z.enum(['Books', 'Electronics', 'Tools', 'Cameras', 'Calculators', 'Project Equipment', 'Other']),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair']),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed').optional(),
  images: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
  availability: z.enum(['always', 'weekdays', 'weekends', 'custom']).optional()
});

export const updateItemSchema = itemSchema.partial();

export const itemStatusSchema = z.object({
  status: z.enum(['Available', 'Maintenance'])
});

export const borrowRequestSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  dueDate: z.string().refine(val => !Number.isNaN(Date.parse(val)), 'Invalid due date')
});

export const approveRejectSchema = z.object({
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional()
});

export const returnSchema = z.object({
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
});

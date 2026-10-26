import { z } from 'zod';

/* ------------------------------------------------------------------ *
 * Schemas
 * ------------------------------------------------------------------ */

export const emailSchema = z.email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const rollNumberSchema = z
  .string()
  .min(5, 'Roll number must be at least 5 characters')
  .max(20, 'Roll number must be less than 20 characters')
  .regex(/^[A-Z0-9]+$/, 'Roll number can only contain uppercase letters and numbers');

export const departmentSchema = z.string().min(1, 'Department is required');

export const yearSchema = z.coerce.number().int().min(1).max(4);

export const itemTitleSchema = z
  .string()
  .min(3, 'Title must be at least 3 characters')
  .max(100, 'Title must be less than 100 characters');

export const itemDescriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(2000, 'Description must be less than 2000 characters');

export const categorySchema = z.enum([
  'Books',
  'Electronics',
  'Tools',
  'Cameras',
  'Calculators',
  'Project Equipment',
  'Other'
]);

export const conditionSchema = z.enum(['New', 'Like New', 'Good', 'Fair']);

export const locationSchema = z
  .string()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must be less than 100 characters');

export const tagsSchema = z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed');

export const imagesSchema = z.array(z.string()).max(5, 'Maximum 5 images allowed');

export const borrowNotesSchema = z.string().max(500, 'Notes must be less than 500 characters').optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    rollNumber: rollNumberSchema,
    department: departmentSchema,
    year: yearSchema
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const itemSchema = z.object({
  title: itemTitleSchema,
  description: itemDescriptionSchema,
  category: categorySchema,
  condition: conditionSchema,
  location: locationSchema,
  tags: tagsSchema,
  images: imagesSchema
});

export const borrowRequestSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  notes: borrowNotesSchema,
  dueDate: z.string().refine(val => !Number.isNaN(Date.parse(val)), 'Invalid due date')
});

export const updateItemSchema = itemSchema.partial();

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function firstIssue(result) {
  if (result.success) return null;
  const issues = result.error.issues || result.error.errors || [];
  return issues[0]?.message || 'Invalid value';
}

export function validateEmail(email) {
  const result = emailSchema.safeParse(email);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validatePassword(password) {
  const result = passwordSchema.safeParse(password);
  let strength = 'weak';

  if (password.length >= 8) strength = 'fair';
  if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'good';
  }
  if (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    strength = 'strong';
  }

  return result.success
    ? { valid: true, strength }
    : { valid: false, message: firstIssue(result), strength };
}

export function validateName(name) {
  const result = nameSchema.safeParse(name);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateRollNumber(rollNumber) {
  const result = rollNumberSchema.safeParse(rollNumber);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateItemTitle(title) {
  const result = itemTitleSchema.safeParse(title);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateItemDescription(description) {
  const result = itemDescriptionSchema.safeParse(description);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateLocation(location) {
  const result = locationSchema.safeParse(location);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateTags(tags) {
  const result = tagsSchema.safeParse(tags);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

export function validateImages(images) {
  const result = imagesSchema.safeParse(images);
  return result.success ? { valid: true } : { valid: false, message: firstIssue(result) };
}

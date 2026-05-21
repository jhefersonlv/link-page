import { z } from 'zod'

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Conta para mim seu nome completinho 😊')
  .max(120, 'Nome muito longo')

export const emailSchema = z
  .string()
  .trim()
  .email('Hum, esse e-mail parece inválido')
  .max(180, 'E-mail muito longo')

// Aceita formatos brasileiros (com ou sem DDI). Normaliza para somente dígitos.
export const phoneSchema = z
  .string()
  .trim()
  .transform((raw) => raw.replace(/\D+/g, ''))
  .refine((digits) => digits.length >= 10 && digits.length <= 13, {
    message: 'Telefone inválido — envie com DDD e número'
  })

export const submitPayloadSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  flagTagIds: z.array(z.string().uuid()).max(20).optional()
})

export type SubmitPayload = z.infer<typeof submitPayloadSchema>

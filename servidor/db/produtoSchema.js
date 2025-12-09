import { z } from 'zod';

export const produtoSchema = z.object({
    codigoProduto: z.number().min(1).positive().int(),
    estoque: z.number().min(1).positive().int(),
    tipo: z.enum(['entrada', 'saida']),
});
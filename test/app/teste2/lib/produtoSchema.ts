import { z } from 'zod';

export const produtoSchema = z.object({
    codigoProduto: z.number().min(1).positive(),
    estoque: z.number().min(1).positive(),
    tipo: z.enum(['entrada', 'saida']),
});
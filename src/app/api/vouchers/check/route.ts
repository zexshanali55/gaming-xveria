import { z } from "zod";
import { fail, ok, parseBody } from "@/lib/http";
import { priceCart } from "@/lib/pricing";

const schema = z.object({
  code: z.string().max(40),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(10) })).min(1).max(50),
});

export async function POST(request: Request) {
  const { data, error } = await parseBody(request, schema);
  if (error) return error;
  const priced = await priceCart(data.items, data.code);
  if (priced.voucherError) return fail(priced.voucherError, 422);
  return ok({ code: priced.appliedCode, discount: priced.discount, total: priced.total });
}

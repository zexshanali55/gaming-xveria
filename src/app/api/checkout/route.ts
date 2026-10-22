import { randomBytes } from "node:crypto";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { fail, ok, parseBody } from "@/lib/http";
import { priceCart } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,16}$/, "Enter a valid mobile number"),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(60).optional(),
  voucher: z.string().max(40).optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(10) })).min(1).max(50),
});

/** Creates an unpaid order. Payment happens next, on PayFast. */
export async function POST(request: Request) {
  const { data, error } = await parseBody(request, schema);
  if (error) return error;

  const priced = await priceCart(data.items, data.voucher);
  if (!priced.lines.length) return fail("Your cart is empty or those games are no longer available.", 409);
  if (priced.voucherError) return fail(priced.voucherError, 422);
  if (priced.hasPhysical && (!data.address || data.address.length < 8 || !data.city)) {
    return fail("A delivery address and city are needed for physical discs.", 422);
  }
  const soldOut = priced.lines.find((l) => l.product.stock < l.quantity);
  if (soldOut) return fail(`${soldOut.product.title} does not have enough stock.`, 409);

  // Signed-in shoppers own their order; guests are attached by email so they
  // still show under Admin → Users.
  const signedIn = await currentUser();
  const email = data.email.toLowerCase();
  const user =
    signedIn ??
    (await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: data.name, phone: data.phone },
    }));

  const count = await prisma.order.count();
  const number = `GX-${1001 + count}-${randomBytes(2).toString("hex").toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      number,
      userId: user.id,
      name: data.name,
      email,
      phone: data.phone,
      address: priced.hasPhysical ? data.address : null,
      city: priced.hasPhysical ? data.city : null,
      subtotal: priced.subtotal,
      discount: priced.discount,
      shipping: priced.shipping,
      total: priced.total,
      voucherCode: priced.appliedCode,
      items: {
        create: priced.lines.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title,
          edition: product.edition,
          platform: product.platform,
          image: product.image,
          price: product.price,
          quantity,
        })),
      },
    },
  });

  return ok({ orderId: order.id });
}

import { notFound, redirect } from "next/navigation";
import { PayfastHandoff } from "@/components/PayfastHandoff";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PayPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, number: true, total: true, paymentStatus: true } });
  if (!order) notFound();
  if (order.paymentStatus === "PAID") redirect(`/order/${order.id}`);
  return <PayfastHandoff order={order} />;
}

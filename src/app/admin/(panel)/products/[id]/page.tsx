import { notFound } from "next/navigation";
import { AdminTitle } from "@/components/admin";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const product = await prisma.product.findUnique({ where: { id: (await params).id } });
  if (!product) notFound();
  return (<><AdminTitle title={`Edit · ${product.title}`} /><ProductForm product={product} /></>);
}

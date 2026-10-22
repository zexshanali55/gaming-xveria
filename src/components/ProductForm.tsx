import { deleteProduct, saveProduct } from "@/app/admin/(panel)/actions";
import type { Product } from "@/generated/prisma";

export function ProductForm({ product }: { product?: Product }) {
  const f = (label: string, name: keyof Product, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="label">{label}</span>
      <input name={name} defaultValue={(product?.[name] as string | number | null | undefined) ?? undefined} className="field" {...props} />
    </label>
  );

  return (
    <div className="max-w-3xl">
      <form action={saveProduct} className="cut space-y-5 border border-line bg-panel p-6">
        {product && <input type="hidden" name="id" value={product.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          {f("Title", "title", { required: true })}
          {f("Slug (auto if empty)", "slug")}
        </div>
        {f("Tagline", "tagline")}
        <label className="block">
          <span className="label">Description</span>
          <textarea name="description" required rows={5} defaultValue={product?.description} className="field" />
        </label>
        {f("Image URL", "image", { required: true, type: "url" })}
        <div className="grid gap-4 sm:grid-cols-3">
          {f("Genre", "genre", { required: true, placeholder: "Racing" })}
          {f("Platform", "platform", { required: true, placeholder: "PC / PS5 / Xbox Series X" })}
          <label className="block">
            <span className="label">Type</span>
            <select name="edition" defaultValue={product?.edition ?? "DIGITAL"} className="field">
              <option value="DIGITAL">Digital (key by email)</option>
              <option value="PHYSICAL">Physical disc</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {f("Price (Rs)", "price", { required: true, type: "number", min: 1 })}
          {f("Compare-at price", "comparePrice", { type: "number", min: 0 })}
          {f("Stock", "stock", { type: "number", min: 0 })}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {f("Developer", "developer")}
          {f("Release year", "releaseYear", { type: "number" })}
          {f("Rating (0–5)", "rating", { type: "number", step: "0.1", min: 0, max: 5 })}
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Live on store</label>
        </div>
        <button className="btn-volt">Save product</button>
      </form>
      {product && (
        <form action={deleteProduct} className="mt-4">
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm text-danger hover:underline">Delete this product</button>
        </form>
      )}
    </div>
  );
}

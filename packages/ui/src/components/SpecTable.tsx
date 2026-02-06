import React from "react";
import type { Product } from "@sonica/shared";
import { getSpecFields } from "@sonica/product-specs";

export interface SpecTableProps {
  product: Product;
  className?: string;
}

/**
 * Renders a specification table for a given product.
 * Uses `@sonica/product-specs` to look up the field definitions for the
 * product's category and formats each value accordingly.
 */
export function SpecTable({ product, className }: SpecTableProps) {
  const fields = getSpecFields(product.category);

  if (fields.length === 0) {
    return null;
  }

  return (
    <table className={className} role="table">
      <caption className="sr-only">
        {product.name} Specifications
      </caption>
      <thead>
        <tr>
          <th scope="col">Specification</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => {
          const rawValue = (product.specs as Record<string, unknown>)[
            field.key
          ];
          const formatted = field.format(rawValue);

          return (
            <tr key={field.key}>
              <td>{field.label}</td>
              <td>
                {formatted}
                {field.unit && rawValue != null ? ` ${field.unit}` : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

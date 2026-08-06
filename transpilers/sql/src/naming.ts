/** Naming rules from docs Database § Naming. */

export function toSnakeCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

/** Entity `User` → `users`; `SalesOrder` → `sales_orders`. */
export function tableName(entity: string): string {
  const snake = toSnakeCase(entity);
  return snake.endsWith("s") ? snake : `${snake}s`;
}

/** Field `seller` + belongs_to User → `seller_id`. */
export function fkColumnName(fieldName: string): string {
  const snake = toSnakeCase(fieldName);
  return snake.endsWith("_id") ? snake : `${snake}_id`;
}

export function quoteIdent(ident: string): string {
  if (/^[a-z_][a-z0-9_]*$/.test(ident)) return ident;
  return `"${ident.replace(/"/g, '""')}"`;
}

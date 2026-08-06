import type {
  AipDocument,
  DefaultValue,
  EntityBlock,
  FieldDecl,
  Span,
  TypeExpr,
} from "@aiparlance/parser";
import type { Diagnostic, ValidateResult } from "./index.js";

const IMPLICIT_FIELDS = ["id", "created_at", "updated_at"] as const;

/** Fields every entity receives (Specification § implicit-fields). */
export function implicitEntityFields(entity: EntityBlock): string[] {
  const fields: string[] = [...IMPLICIT_FIELDS];
  if (entity.body.some((m) => m.kind === "soft_delete")) {
    fields.push("deleted_at");
  }
  return fields;
}

function hasSoftDelete(entity: EntityBlock): boolean {
  return entity.body.some((m) => m.kind === "soft_delete");
}

export function validateDocument(doc: AipDocument): ValidateResult {
  const diagnostics: Diagnostic[] = [];
  const entities = new Map<string, EntityBlock>();
  const validationEntities = new Set<string>();

  if (!doc.app.members.some((m) => m.kind === "database")) {
    pushError(
      diagnostics,
      "missing_database",
      "app block must declare database postgres|mysql",
      doc.app.span
    );
  }

  if (doc.app.version === null) {
    pushWarning(
      diagnostics,
      "missing_version",
      "app block should include @0.1 version tag",
      doc.app.span
    );
  }

  for (const block of doc.blocks) {
    if (block.kind !== "Entity") continue;

    if (entities.has(block.name)) {
      pushError(
        diagnostics,
        "duplicate_entity",
        `duplicate entity '${block.name}'`,
        block.span
      );
      continue;
    }
    entities.set(block.name, block);
    validateEntityBody(block, diagnostics);
  }

  for (const block of doc.blocks) {
    switch (block.kind) {
      case "Crud":
        if (!entities.has(block.entity)) {
          pushError(
            diagnostics,
            "unknown_entity_ref",
            `crud references unknown entity '${block.entity}'`,
            block.span
          );
        }
        break;
      case "Validation":
        if (validationEntities.has(block.entity)) {
          pushError(
            diagnostics,
            "duplicate_validation_block",
            `duplicate validation block for entity '${block.entity}'`,
            block.span
          );
        }
        validationEntities.add(block.entity);

        const entity = entities.get(block.entity);
        if (!entity) {
          pushError(
            diagnostics,
            "unknown_entity_ref",
            `validation references unknown entity '${block.entity}'`,
            block.span
          );
          break;
        }
        validateValidationBlock(block, entity, diagnostics);
        break;
      default:
        break;
    }
  }

  for (const entity of entities.values()) {
    for (const item of entity.body) {
      if (item.kind !== "Field") continue;
      checkBelongsToRef(item.type, entities, item.span, diagnostics);
    }
  }

  const ok = !diagnostics.some((d) => d.severity === "error");
  return { ok, diagnostics };
}

function validateEntityBody(entity: EntityBlock, diagnostics: Diagnostic[]): void {
  const fieldNames = new Set<string>();
  const implicit = new Set(implicitEntityFields(entity));

  for (const item of entity.body) {
    if (item.kind !== "Field") continue;

    if (fieldNames.has(item.name)) {
      pushError(
        diagnostics,
        "duplicate_field",
        `duplicate field '${item.name}' on entity '${entity.name}'`,
        item.span
      );
      continue;
    }
    fieldNames.add(item.name);

    validateFieldModifiers(item, diagnostics);
    validateTypeExpr(item.type, item, diagnostics);

    if (
      implicit.has(item.name) &&
      !(item.name === "id" && item.type.kind === "Primitive" && item.type.name === "uuid")
    ) {
      pushWarning(
        diagnostics,
        "implicit_field_shadow",
        `field '${item.name}' on '${entity.name}' shadows an implicit column (${item.name} is injected by default)`,
        item.span
      );
    }
  }

  if (hasSoftDelete(entity) && fieldNames.has("deleted_at")) {
    const field = entity.body.find(
      (f): f is FieldDecl => f.kind === "Field" && f.name === "deleted_at"
    );
    if (field) {
      pushWarning(
        diagnostics,
        "implicit_field_shadow",
        `field 'deleted_at' is redundant with soft_delete on '${entity.name}'`,
        field.span
      );
    }
  }
}

function validateFieldModifiers(
  field: FieldDecl,
  diagnostics: Diagnostic[]
): void {
  let seenRequired = false;
  let seenOptional = false;
  let seenUnique = false;
  let seenDefault = false;
  let phase: "presence" | "unique" | "default" = "presence";

  for (const mod of field.modifiers) {
    if (mod.kind === "required" || mod.kind === "optional") {
      if (phase !== "presence") {
        pushError(
          diagnostics,
          "modifier_order",
          `field '${field.name}': required|optional must precede unique and default`,
          field.span
        );
      }
      if (mod.kind === "required") {
        if (seenRequired) {
          pushWarning(
            diagnostics,
            "duplicate_modifier",
            `field '${field.name}': duplicate required modifier`,
            field.span
          );
        }
        if (seenOptional) {
          pushError(
            diagnostics,
            "modifier_conflict",
            `field '${field.name}': cannot be both required and optional`,
            field.span
          );
        }
        seenRequired = true;
      } else {
        if (seenOptional) {
          pushWarning(
            diagnostics,
            "duplicate_modifier",
            `field '${field.name}': duplicate optional modifier`,
            field.span
          );
        }
        if (seenRequired) {
          pushError(
            diagnostics,
            "modifier_conflict",
            `field '${field.name}': cannot be both required and optional`,
            field.span
          );
        }
        seenOptional = true;
      }
      continue;
    }

    if (mod.kind === "unique") {
      if (phase === "default") {
        pushError(
          diagnostics,
          "modifier_order",
          `field '${field.name}': unique must precede default`,
          field.span
        );
      }
      phase = "unique";
      if (seenUnique) {
        pushWarning(
          diagnostics,
          "duplicate_modifier",
          `field '${field.name}': duplicate unique modifier`,
          field.span
        );
      }
      seenUnique = true;
      continue;
    }

    if (mod.kind === "default") {
      phase = "default";
      if (seenDefault) {
        pushError(
          diagnostics,
          "duplicate_modifier",
          `field '${field.name}': duplicate default modifier`,
          field.span
        );
      }
      seenDefault = true;
      validateDefaultValue(field.type, mod.value, field, diagnostics);
    }
  }
}

function validateDefaultValue(
  type: TypeExpr,
  value: DefaultValue,
  field: FieldDecl,
  diagnostics: Diagnostic[]
): void {
  if (type.kind !== "Enum" || value.kind !== "ident") return;
  if (!type.variants.includes(value.value)) {
    pushError(
      diagnostics,
      "invalid_enum_default",
      `field '${field.name}': default '${value.value}' is not in enum(${type.variants.join(", ")})`,
      field.span
    );
  }
}

function validateTypeExpr(
  type: TypeExpr,
  field: FieldDecl,
  diagnostics: Diagnostic[]
): void {
  if (type.kind === "Enum" && type.variants.length === 0) {
    pushError(
      diagnostics,
      "empty_enum",
      `field '${field.name}': enum must list at least one variant`,
      field.span
    );
  }
}

function checkBelongsToRef(
  type: TypeExpr,
  entities: Map<string, EntityBlock>,
  span: Span,
  diagnostics: Diagnostic[]
): void {
  if (type.kind !== "BelongsTo") return;
  if (!entities.has(type.entity)) {
    pushError(
      diagnostics,
      "unknown_entity_ref",
      `belongs_to references unknown entity '${type.entity}'`,
      span
    );
  }
}

function validateValidationBlock(
  block: Extract<AipDocument["blocks"][number], { kind: "Validation" }>,
  entity: EntityBlock,
  diagnostics: Diagnostic[]
): void {
  const entityFields = new Set(
    entity.body.filter((b): b is FieldDecl => b.kind === "Field").map((f) => f.name)
  );
  const seenRules = new Set<string>();

  for (const rule of block.rules) {
    if (!entityFields.has(rule.field)) {
      pushError(
        diagnostics,
        "unknown_field",
        `validation rule for unknown field '${rule.field}' on entity '${entity.name}'`,
        block.span
      );
    }
    const key = `${rule.field}:${rule.modifiers.join(",")}`;
    if (seenRules.has(rule.field)) {
      pushWarning(
        diagnostics,
        "duplicate_validation_rule",
        `duplicate validation rules for field '${rule.field}' on '${entity.name}'`,
        block.span
      );
    }
    seenRules.add(rule.field);
    void key;

    validateValidationRuleModifiers(rule.field, rule.modifiers, block.span, diagnostics);
  }
}

function validateValidationRuleModifiers(
  field: string,
  modifiers: Array<"required" | "unique">,
  span: Span,
  diagnostics: Diagnostic[]
): void {
  let phase: "required" | "unique" = "required";
  let seenRequired = false;
  let seenUnique = false;

  for (const mod of modifiers) {
    if (mod === "required") {
      if (phase === "unique" && !seenRequired) {
        pushWarning(
          diagnostics,
          "modifier_order",
          `validation '${field}': prefer required before unique`,
          span
        );
      }
      if (seenRequired) {
        pushWarning(
          diagnostics,
          "duplicate_modifier",
          `validation '${field}': duplicate required`,
          span
        );
      }
      seenRequired = true;
      continue;
    }
    phase = "unique";
    if (seenUnique) {
      pushWarning(
        diagnostics,
        "duplicate_modifier",
        `validation '${field}': duplicate unique`,
        span
      );
    }
    seenUnique = true;
  }
}

function pushError(
  diagnostics: Diagnostic[],
  code: string,
  message: string,
  span: Span
): void {
  diagnostics.push({
    severity: "error",
    code,
    message,
    line: span.start.line,
    column: span.start.column,
  });
}

function pushWarning(
  diagnostics: Diagnostic[],
  code: string,
  message: string,
  span: Span
): void {
  diagnostics.push({
    severity: "warning",
    code,
    message,
    line: span.start.line,
    column: span.start.column,
  });
}

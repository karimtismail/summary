import { isValidElement, type ReactNode } from "react";

type NodeWithChildren = {
  children?: ReactNode;
};

export function reactNodeToText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(reactNodeToText).join("");
  if (isValidElement<NodeWithChildren>(value)) return reactNodeToText(value.props.children);
  return "";
}

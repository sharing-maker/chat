import { useId as useUID } from "@reach/auto-id";

const generatePrefix = (prefix: string, id: string) => {
  return `${prefix}-${id}`;
};

/**
 * Reack hook to generate unique id
 *
 * @param idProp the external id passed from the user
 * @param prefix prefix to append before the id
 */
export const useId = (idProp?: string, prefix?: string) => {
  const uuid = useUID() as string;
  const id = idProp ?? uuid;
  const result = prefix ? generatePrefix(prefix, id) : id;

  return result as string;
};

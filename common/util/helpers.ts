export const plural = (count: number, singular: string, plural: string) =>
  count <= 1 && count >= -1 ? `${count} ${singular}` : `${count} ${plural}`;

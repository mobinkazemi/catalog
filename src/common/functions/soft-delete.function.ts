export function isSoftDelete(data: object): boolean {
  if (data['deletedAt'] || (data['$set'] && data['$set']['deletedAt'])) {
    return true;
  }
  return false;
}

export function handleSoftDeleteConcerns(data: object) {
  delete data['$set']['updatedAt'];
  return data;
}

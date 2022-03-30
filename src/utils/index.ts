/**
 * 对象的深拷贝
 * @param data
 * @returns
 */
export function cloneData(data: any) {
  return JSON.parse(JSON.stringify(data))
}

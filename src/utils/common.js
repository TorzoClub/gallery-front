export function updateListItem(list, findFn, updateFn) {
  return list.map((item) => {
    return findFn(item) ? { ...item, ...updateFn({ ...item }) } : item
  })
}

export function updateListItemByProperty(list, findProperty, propertyValue, updateData) {
  return updateListItem(
    list,
    (item) => item[findProperty] === propertyValue,
    () => updateData
  )
}

export function updateListItemById(list, id, updateData) {
  return updateListItemByProperty(list, 'id', id, updateData)
}

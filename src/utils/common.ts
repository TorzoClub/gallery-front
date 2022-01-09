export function updateListItem<
  P extends string,
  PV,
  Item extends Record<P, PV> & Record<string, unknown>
>(
  list: Item[],
  findFn: (item: Item) => boolean,
  updateFn: (item: Readonly<Item>) => { [k in keyof Item]?: Item[k] }
) {
  return list.map((item) => {
    return findFn(item) ? { ...item, ...updateFn({ ...item }) } : item
  })
}

export function updateListItemByProperty<
  P extends string,
  PV,
  Item extends Record<P, PV> & Record<string, unknown>
>(list: Item[], findProperty: P, propertyValue: PV, updateData: Partial<Item>) {
  return updateListItem(
    list,
    (item) => item[findProperty] === propertyValue,
    () => updateData
  )
}

export function updateListItemById<
  IDV,
  Item extends Record<'id', IDV> & Record<string, unknown>
>(list: Item[], id: IDV, updateData: { [k in keyof Item]?: Item[k] }) {
  return updateListItemByProperty(list, 'id', id, updateData)
}

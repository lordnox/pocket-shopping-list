export type CompareFn<Type> = (a: Type, b: Type) => number
export const updateCurrentItemList = <Type extends { id: string; name: string }>(
  currentItemList: Type[],
  updatedItemList: Type[],
  compare: CompareFn<Type>,
) => {
  const updateItemIds = new Set(updatedItemList.map((item) => item.id))
  let index = currentItemList.length

  while (index--) {
    const currentItem = currentItemList[index]
    const updatedItem = updatedItemList.find((existingItem) => existingItem.id === currentItem.id)
    if (!updatedItem) {
      // remove the currentItem from the currentItemList
      currentItemList.splice(index, 1)
      continue
    }
    // remove the updated item from the id list
    updateItemIds.delete(updatedItem.id)
    // check if there are differences
    if (!compare(currentItem, updatedItem)) continue
    // if there are differences, update the item in the current item list
    currentItemList[index] = updatedItem
  }
  // for all remaining updated item ids, update them in the current item list
  updateItemIds.forEach((id) => {
    const item = updatedItemList.find((item) => item.id === id)
    if (item) currentItemList.push(item)
  })

  return currentItemList
}

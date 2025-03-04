export function getRolesContains(rolesArr, groups) {
    return groups && groups.length > 0 && rolesArr.filter(role => { return groups.includes(role)})
}

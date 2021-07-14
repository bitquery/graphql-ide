const isObject = value => typeof value === 'object' && value !== null && !Array.isArray(value)
function treeBypass(row, nodeOrPrimitive, propertie, stat) {
    if (isObject(nodeOrPrimitive)) {
        Object.keys(nodeOrPrimitive).forEach(prop => {
            row = {...row, ...treeBypass(row, nodeOrPrimitive[prop], prop, propertie)}
        })
    } else {
        let property = { [`${stat}${propertie}`] : nodeOrPrimitive }
        row = {...row, ...property}
    }
    return row
}
export function flattenData(data) {
    let columns = []
    Object.keys(data).forEach(network => {
        let row = { network }
        Object.keys(data[network]).forEach(stat => {
            let dataNetworkStats = data[network][stat][0]
            Object.keys(dataNetworkStats).forEach(prop => {
                row = {...row, ...treeBypass(row, dataNetworkStats[prop], prop, stat)}
            })
        })
        columns.push(row)
    })
    return columns
}

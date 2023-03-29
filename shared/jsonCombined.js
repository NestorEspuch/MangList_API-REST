// function convertToJson(jsonObjects) {
//     const jsonString = jsonObjects.map((obj) => JSON.stringify(obj)).join("");
//     return JSON.parse(jsonString);
// }

function convertToJson(jsonObjects) {
    const jsonArray = [];
    jsonObjects.forEach((obj) => {
        jsonArray.push(obj.data);
    });

    return jsonArray;
}

module.exports = { convertToJson };
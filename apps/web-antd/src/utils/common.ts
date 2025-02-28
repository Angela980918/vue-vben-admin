import {useTemplateStore} from "#/store";
// 其他共用類方法
export const getLabel = (map, value, defaultLabel = '未知') => {
    const item = map.find(item => item.value === value);
    return item ? item.label : defaultLabel;
};

//处理模板信息
export const handleTemplateMsg = (name, language) => {
    // console.log("name, language", name, language)
    let rawTemplate = useTemplateStore().getRawTemplateList;
    let result = rawTemplate.find((item) => item.name === name && item.language === language)
    // console.log("resultresult",result)
    const {components} = result;
    let msgContent = {};
    for (let index in result.components) {
        if (components[index].type === "HEADER") {
            msgContent.header = {
                format: components[index].format,
            }

            if (components[index].format === "TEXT") {
                msgContent.header.content = components[index].text;
            } else {
                msgContent.header.content = components[index].example.header_url[0]

                let body = {
                    type: "header",
                    parameters: [{
                        type: components[index].format.toLowerCase()
                    }]
                }
                const dynamicKey = `${body.parameters[0].type}`;
                let typeIndex = body.parameters[0];
                typeIndex[dynamicKey] = {
                    link: components[index].example.header_url[0]
                };
            }

        } else if (components[index].type === "BODY") {
            msgContent.body = {
                content: components[index].text
            }
        } else if (components[index].type === "FOOTER") {
            msgContent.footer = {
                content: components[index].text
            }
        }
    }
    return msgContent;
}

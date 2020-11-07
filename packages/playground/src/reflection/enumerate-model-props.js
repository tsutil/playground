class DemoModel {
}
const ATTRIBUTES_KEY = 'sequelize:attributes';

module.parent == null && main().catch(console.error);
async function main() {
    const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, DemoModel.prototype);
    const meta = Object
        .keys(attributes)
        .reduce((res, key) => {
            const propMetadata = attributes[key] && attributes[key].type || {};
            res[key] = propMetadata.key;
            return res;
        }, {});
    console.log(meta);
}

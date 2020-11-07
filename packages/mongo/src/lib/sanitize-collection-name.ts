import { CollectionName } from '../collection-name';

const PROHIBITED_CHARACTERS = [...'/\\. "$*<>:|?'];
const SANITAZE_NAME_REGEX = prohibitedCharactersRegex();

function prohibitedCharactersRegex(){
    const excaped = PROHIBITED_CHARACTERS.map(x => `\\${x}`).join('');
    return new RegExp(`[${excaped}]`, 'g');
}

/**
 * Replace prohibited characters with underscore
 * see: {@link https://docs.mongodb.com/manual/reference/limits/#restrictions-on-db-names mongo naming restrictions}
 */
export function sanitizeCollectionName(name: CollectionName) {
    if(Array.isArray(name)){
        return [name[0], sanitizeCollectionName(name)];
    }
    if(name == null){
        return null;
    }
    return name.replace(SANITAZE_NAME_REGEX, '_');
}

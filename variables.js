const variables = {
    'ROOT': process.env.ROOT,
    'DB_CONNECTION': process.env.DB_CONNECTION,
    'GMAIL_ADDR': process.env.GMAIL_ADDR,
    'OAuth_C_ID': process.env.OAuth_C_ID,
    'OAuth_C_S': process.env.OAuth_C_S,
    'R_TOKEN': process.env.R_TOKEN,
}

const keys = Object.keys(variables);
const notSet = [];

for (const key of keys) {
    if(!variables[key]) {
        notSet.push(key);
        continue;
    }
}

if(notSet) {
    console.log('[HIBA]: Egy vagy több környezeti változó nincs beállítva! A szerver leáll...');
    console.log('[HIBA]:Nem beállított változók: '+ notSet)
    process.exit(0);
}else{
    return true;
}
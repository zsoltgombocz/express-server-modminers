const variables = {
    'ROOT': process.env.ROOT,
    'DB_CONNECTION': process.env.DB_CONNECTION,
    'GMAIL_ADDR': process.env.GMAIL_ADDR,
    'OAuth_C_ID': process.env.OAuth_C_ID,
    'OAuth_C_S': process.env.OAuth_C_S,
    'R_TOKEN': process.env.R_TOKEN,
    'TOKEN_SECRET': process.env.TOKEN_SECRET
}

const keys = Object.keys(variables);
const notSet = [];
let halt = false;
for (const key of keys) {
    if(!variables[key]) {
        notSet.push(key);
        halt = true;
        continue;
    }
}

if(halt) {
    console.log('[HIBA]: Egy vagy több környezeti változó nincs beállítva! A szerver leáll...');
    console.log('[HIBA]: Nem beállított változók: '+ notSet)
    process.exit(0);
}else{
    return true;
}
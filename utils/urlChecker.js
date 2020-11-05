const Links = require('../models/url');


const urlChecker = async (id, attrs) => {
    // get all users
    const records = await Links.find();
    
    // find user with id
    const entry = records.find((item) => {
        return item.short === id;
    });

    if(!entry) {
        throw new Error(`Record of id ${id} not found!`)
    }

    const res = attrs.full.reduce( (acc, curr) => {

        const stored = entry.full.find( ({ url }) => {
            return url === curr.url;
        });

        if(stored){
            if(stored.perc !== curr.perc){
                stored.perc = curr.perc;
            }
            acc.push(stored);
        } else {
            acc.push(curr);
        }
        return acc;

    }, []);

    entry.full = res;
    entry.name = attrs.name;


    return {
        full: res,
        name: attrs.name
    }
}

module.exports = urlChecker;
const randomizer = (link) => {
    let urlArray = [];
    let percArray = [];
    let visitsArray = [];
    let totalVisits = link.clicks + 1;
    let toBeServed = '';
    let values;
    let fullObj; 


    link.full.forEach((item) => {
        urlArray.push(item.url);
        percArray.push(item.perc);
        visitsArray.push(item.visits);
    });

    const totalUrls = urlArray.length;

    for(let i = 0; i < totalUrls; i++){
        const servedPercent = (visitsArray[i] / totalVisits) * 100;

        if(servedPercent < (percArray[i] * 100)) {
            toBeServed = urlArray[i];
            visitsArray[i] = visitsArray[i] + 1;
            break;
        }
    }

    values = urlArray.map((url, i) => {
        return {
            url, perc: percArray[i], visits: visitsArray[i]
        }
    });

    fullObj = {
        name: link.name,
        clicks: totalVisits,
        full: values,
    };

    return {
        updated: fullObj,
        redirectedUrl: toBeServed
    }


}

module.exports = randomizer;


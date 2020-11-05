const isArray = (name, urlArr, percArr) => {
  let values;
  let fullObj;

  if(Array.isArray(urlArr)){

      values = urlArr.map((url, i) => {
        return {
            url, perc: percArr[i] / 100, visits: 0
        }
      });

      fullObj = {
        name,
        clicks: 0,
        full: values,
      };
  }else{
      values = {
        url: urlArr, perc: percArr / 100, visits: 0
      };

      fullObj = {
        name,
        clicks: 0,
        full: [values]
      };
  }

  return fullObj;
}

module.exports = isArray;




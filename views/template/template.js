const moment = require('moment');


const tbodyTemplate = ( links, page ) => {
    const tbodyContent = links.map(item => {
      const rotatorName = item.name;
      const rotatorUrl = item.short;
      const rotatorClicks = item.clicks;
      const timestamp = moment(item.createdAt).fromNow();  
      let destinationUrls = "";
      let titleBtnsHtml;

      if(page === 'dashboard'){
        titleBtnsHtml = `
          <div class="float-right">

            <a class="link-slug-copy" role="button">
               <ion-icon name="copy-outline" class="mr-1" title="Copy" data-icon="icon"></ion-icon>
            </a>

            <a href="/links/${rotatorUrl}/edit" class="link-edit-btn" role="button">
               <ion-icon name="create-outline" class="mr-1" data-icon="icon"  title="Edit"></ion-icon>
            </a>

             <button type="button" data-id="${rotatorUrl}" data-toggle="modal" data-target="#exampleModalCenter">
                <ion-icon name="trash-outline" class="mr-1" data-icon="icon" title="Delete"></ion-icon>
             </button>

         </div>
        `;
      }else if(page === 'archive') {
        titleBtnsHtml = `
          <div class="float-right">

            <form action="/archive/restore/${rotatorUrl}?_method=PUT" method="POST" class="d-inline-block">
              <button type="submit">
                <ion-icon name="refresh" class="mr-1" data-icon="icon" title="Restore"></ion-icon>
              </button>
            </form>
            <button type="button" data-id="${rotatorUrl}" data-toggle="modal" data-target="#exampleModalCenter">
              <ion-icon name="trash-outline" class="mr-1" data-icon="icon" title="Delete"></ion-icon>
            </button>
         </div>
        `;
      }

        if(item.full.length < 2 && item.full.length > 0) {
          destinationUrls = item.full.map(el => {
            return `
                <td>
                  <a href="${el.url}">${el.url}</a>
                </td>
                <td>${el.visits}</td>
                <td>${(el.perc) * 100}%</td>
            `;
          }).join('\n');

          return `
              <tr data-slug="${rotatorUrl}" class="withoutRow">
                 <td scope="row" id="link-btn">

                    <div class="rotator-title overflow-hidden mb-2 ml-1">
                       <div class="float-left">
                          <h5>${rotatorName}</h5>
                       </div>

                       ${titleBtnsHtml}      
                    </div>

                    <div class="d-table mb-2">
                       <ion-icon name="link" class="mr-1"></ion-icon>
                       <a href="/${rotatorUrl}" class="dash-link d-table-cell align-middle" target="_blank"><span class="host-name"></span>/${rotatorUrl}</a>
                    </div>

                    <div class="timestamp ml-1">
                       <p>${timestamp}</p> 
                    </div>

                    

                 </td>

                 <td>${rotatorClicks}</td>
                 ${destinationUrls}
              </tr>
          `;
        }else{
          destinationUrls = item.full.map(el => {
            return `
                  <td>
                    <a href="${el.url}">${el.url}</a>
                  </td>
                  <td>${el.visits}</td>
                  <td>${(el.perc) * 100}%</td> 
            `;
          });

          const firstEl = destinationUrls.shift();
          const destinationUrlsNew = destinationUrls.map((each) => {
            return `
              <tr data-slug="${rotatorUrl}">
                ${each}
              </tr>
            `;
          });
          const rowSpan = item.full.length;

          return `
            <tr data-slug="${rotatorUrl}">
                 <td rowspan="${rowSpan}" scope="row" id="link-btn">

                    <div class="rotator-title overflow-hidden mb-2 ml-1">
                       <div class="float-left">
                          <h5>${rotatorName}</h5>
                       </div>

                       ${titleBtnsHtml}      
                    </div>

                    <div class="d-table mb-2">
                       <ion-icon name="link" class="mr-1"></ion-icon>
                       <a href="/${rotatorUrl}" class="dash-link d-table-cell align-middle" target="_blank"><span class="host-name"></span>/${rotatorUrl}</a>
                    </div>
                    
                    <div class="timestamp ml-1">
                       <p>${timestamp}</p> 
                    </div>

                    

                 </td>

                <td rowspan="${rowSpan}">${rotatorClicks}</td>
                ${firstEl}
            </tr>
            ${destinationUrlsNew.join('\n')}
          `;  
        }

    }).join('\n');

    return  `
      <tbody>
        ${tbodyContent}
      </tbody>                
    `;
};



module.exports = tbodyTemplate;


















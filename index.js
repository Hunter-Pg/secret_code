const puppeteer = require("puppeteer");

const URL = 'https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub';

const fetchDocData = async (url) =>
{
    const browser = await puppeteer.launch({ headless: true, args: ['--incognito'] });
    const [ page ] = await browser.pages(); 
    try 
    {
        await page.goto(url);
        await page.waitForSelector('tr[class^="c"]');

        const allPoints = await page.$$eval('tr[class^="c"]', (elems) =>
        {
            let pointsInfoAry = [];
            for (const elem of elems)
            {
                let pointInfoAry = [];
                Array.from(elem.querySelectorAll('td')).map(poltElem => pointInfoAry.push(poltElem.innerText));

                pointsInfoAry.push(pointInfoAry);
            }
            return pointsInfoAry.filter(e => {if (Number(e[0])) return e});
        });

        return allPoints;
    } 
    catch (error) 
    {
        console.error('::> fetchDocData:',error);
    }
    finally
    {
        await browser.close();
    }
}

const createGridAry = (messageInfoAry) =>
{
    const gridX = Math.max(...messageInfoAry.map(pointElem => Number(pointElem[2])));
    const gridY = Math.max(...messageInfoAry.map(pointElem => Number(pointElem[0])));

    let gridAry = [];
    for (var x=0; x <= gridX; x++) {
        gridAry[x] = [];
      for (var y=0; y <= gridY; y++) {
        gridAry[x][y] = " ";
      }
    }
    messageInfoAry.map(pointElem =>
        {
            const coordinateX = Number(pointElem[2]);
            const coordinateY = Number(pointElem[0]);

            gridAry[coordinateX][coordinateY] = pointElem[1];
        });

    return gridAry;
}

const logSecretMessage = (gridAry) =>
{
    for (var i=gridAry.length; i > 0; i--)
    {
        const rowAry = gridAry[i-1];
        let oneRow = "";
        for (const e of rowAry)
        {
            oneRow += e;
        }
        console.log(oneRow);
    }
}
const createSecretMessage = async (url) =>
{
    const messageInfoAry = await fetchDocData(url);
    const gridAry = createGridAry(messageInfoAry);
    logSecretMessage(gridAry);
}


createSecretMessage(URL);
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment= require('moment');
const {tempFooter, tempHeader}= require('./templates/templates');
const {promisify}=require('util');
const juice =require('juice');
const data = require('./data.json');
const data1=require('./info.json');

const configJuice={
  applyStyleTags:true,
  removeStyleTags: true,
  preserveMediaQueries: true,
  preserveFontFaces: true,
  applyWidthAttributes: true,
  applyHeightAttributes: true,
  applyAttributesTableElements: true
}

// compile=async(templateName, data, path_=path.join('templates',process.cwd()))=>{
  compile=async(templateName, data, path_=path.join(__dirname,'templates'))=>{
    console.log('hetea',path_,']sa',process.cwd(),'sdf;',path.join(path_,`${templateName}.hbs`))
  const filePath= path.join(path_,`${templateName}.hbs`);
  console.log('dos',filePath)
  const html= await fs.readFile(filePath, 'utf-8');
  return juice(hbs.compile(html)(data), configJuice)
}

hbs.registerHelper('dateFormat',(value,format)=>{
  return moment(value).format(format); 
});

const OUT_FILE = 'format_1.html';

generatePdf=async()=>{
  try{
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox']});
    const page = await browser.newPage();
    // const content= await compile('format_pdf', data);
    // const content= await compile('informe_inicio', data1,undefined);
    // const content= await compile('informe_inicio', data1,undefined);
    const content= await compile('test', data1,undefined);
  //   await promisify(fs.writeFile)(OUT_FILE, `
  //   <html>
  //     <h3>hello image!</h3>
  //     <img src="image1.jpg">
  //   </html>
  // `)
  // console.log(content)
  // console.log(juice.inlineContent(content,'./templates/style.css'))
  // await promisify(fs.writeFile)(OUT_FILE, content);

  // const use=juice(content, configJuice);
  // console.log(juice(tempHeader, configJuice))
  await promisify(fs.writeFile)(OUT_FILE, content);
    // await page.setContent(content,{ waitUntil: 'networkidle' });
    // await page.emulateMedia('screen');
    // await page.goto(`data:text/html,${content}`, { waitUntil: 'netwoerkidle0' });
    await page.goto(`file://${process.cwd()}/${OUT_FILE}`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: 'test.pdf',
      format: 'A4',
      printBackground: true,
      headerTemplate: tempHeader,
      footerTemplate:tempFooter,
      displayHeaderFooter: true,
      margin: {
        top: '65mm',
        right: '25mm',
        bottom: '25mm',
        left: '25mm'
      }
    })
    console.log('llego aca ?')
    await browser.close();
    console.log('?as')
    // await process.exit();
    // console.log('salio?')

  }catch(err){
    console.log('Error ', console.error(err));
  }
}

// generatePdf()

// compile('informe_inicio',{
//   email: 'req.body.email',
//   password:"hola",
// },undefined)
// generatePdf()
// (async()=>{
//   try{
//     // const browser = await puppeteer.launch();
//     const browser = await puppeteer.launch({
//       // headless: false,
//       args: ['--no-sandbox']});
//     const page = await browser.newPage();
//     // const content= await compile('format_pdf', data);
//     const content= await compile('informe_inicio', data1);
//       // console.log(content)
//   //   await promisify(fs.writeFile)(OUT_FILE, `
//   //   <html>
//   //     <h3>hello image!</h3>
//   //     <img src="image1.jpg">
//   //   </html>
//   // `);
//   await promisify(fs.writeFile)(OUT_FILE, content);
//     // console.log(content)
//     // await page.setContent(content,{ waitUntil: 'networkidle' });
//     // await page.emulateMedia('screen');
//     // await page.goto(`data:text/html,${content}`, { waitUntil: 'netwoerkidle0' });
//     // console.log('////////////--//',process.cwd())
//     await page.goto(`file://${process.cwd()}/${OUT_FILE}`, { waitUntil: 'networkidle0' });
//     await page.pdf({
//       path: 'test.pdf',
//       format: 'A4',
//       printBackground: true,
//       headerTemplate: tempHeader,
//       footerTemplate:tempFooter,
//       displayHeaderFooter: true,
//       margin: {
//         top: '65mm',
//         right: '25mm',
//         bottom: '25mm',
//         left: '25mm'
//       }
//     })
    
//     console.log('Success!!!');
//     await browser.close();
//     process.exit();

//   }catch(err){
//     console.log('Error ', console.error(err));
//   }
// })();

module.exports={compile}
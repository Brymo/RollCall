const puppeteer = require("puppeteer");

const url = "https://forms.office.com/Pages/ResponsePage.aspx?id=EBQfvtWH7EWsLigsaPOCv7WyajnICulItLoeI3kI78dUMUFNWjU1S1oyWkZVVjlQSUNMQjMxMzVWNCQlQCN0PWcu&qrcode=true&fbclid=IwAR0j_X7Af1cuuYc7jNAxHYvr5IdZy56XT0lkT-m79UgYKzQllpW7X6R05Mg";

const subjects = [
    "Contemporary Leadership & Pastoring",
    "Encountering the Holy Spirit",
    "World Religions",
    "New Testament Study: Galatians & Romans",
]

let iteration = subjects.length - 1;

async function run(){
    console.log("running");
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage();
    await page.goto(url);
    while (iteration >= 0){
        const firstNameTextBox = await page.waitForSelector(".office-form-question-textbox", {visible: true});
        const surnameTextBox = await page.$("#form-container > div > div > div.office-form-content.office-form-page-padding > div > div.office-form.office-form-theme-shadow > div.office-form-body > div.office-form-question-body > div:nth-child(3) > div > div.office-form-question-element > div > div > input");
        await firstNameTextBox.type("Bryan");
        await surnameTextBox.type("Moh");

        const level = await page.$x("//span[contains(., 'Diploma')]");
        await level[0].click();
        const subject = await page.$x(`//span[contains(., '${subjects[iteration]}')]`);
        await subject[0].click();

        //Accounting for the thursday subjects bug
        try{
            const redundantSubject = await page.$x(`//span[contains(., 'Christian Doctrine 3')]`);
            await redundantSubject[0].click();
        }catch{

        }

        const onTimeDropdown = await page.$(".office-form-question-dropdown");
        await onTimeDropdown.click();
        const onTimeButton = await onTimeDropdown.$("div[aria-label='On Time']");
        await onTimeButton.click();

        const submitButton = await page.$x("//button[contains(., 'Submit')]");
        await submitButton[0].click();

        await page.waitForXPath("//a[contains(., 'Submit another response')]");

        console.log(`Signed in to subject: ${subjects[iteration]}`);


        const submitAnotherResponseButton = await page.$x("//a[contains(., 'Submit another response')]");
        await submitAnotherResponseButton[0].click();

        iteration--;
    }

    console.log("All done!  Don't tell Nathan Ross shhhh")
    browser.close(); 
}

run();
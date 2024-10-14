import { sleep, check } from "k6"

export class MainPage {
  constructor(page) {
    this.page = page
    this.ssoField = page.locator('#identifierInput')
    this.nextButton = page.locator('#post-button')
    this.passwordField = page.locator('#password')
    this.loginButton = page.locator('#remember-me-login-button')
    this.welcomeHeader = page.locator('//*[@class="heading"]')
  }

  async goto(url = 'https://the-internet.herokuapp.com/') {
    await this.page.goto(url, { waitUntil: 'networkidle'})
  }

  async submitForm(sso, password) {
    if (sso === undefined) {
      console.log("SSO hasn't been provided")
    } 
    
    if (password === undefined) {
      console.log("password hasn't been provided")
    } 

    if (this.page.url().includes("fssfedpitc.ge.com")) {
      // zscaler login
      await this.ssoField.type(sso)
      await Promise.all([this.page.waitForNavigation(), this.nextButton.click()])
      await this.passwordField.type(password)
      await Promise.all([this.page.waitForNavigation(), this.loginButton.click()])
    }
    sleep(3)

    check(this.page, {
      "welcome header is correct": () => {
        const actualHeader = this.welcomeHeader.textContent()
        const expectedHeader = "Welcome to the-internet"
        const checkPassed = actualHeader === expectedHeader
        return checkPassed
      }
    })
    this.page.screenshot({ path: 'screenshots/main.png' })
  }
}

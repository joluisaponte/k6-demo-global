import { check, sleep } from "k6"

export class AddRemove {
  constructor(page) {
    this.page = page
    this.ssoField = page.locator('#identifierInput')
    this.nextButton = page.locator('#post-button')
    this.passwordField = page.locator('#password')
    this.loginButton = page.locator('#remember-me-login-button')
    this.url = page.locator('//a[@href="/add_remove_elements/"')
    this.header = page.locator('#content > h3')
    this.addElementButton = page.locator('//*[@class="example"]/button')
    this.deleteButton = page.locator('//*[@id="elements"]/button')
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/add_remove_elements/', { waitUntil: 'networkidle' })
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
      "Header Add/Remove Elements is Visible": () => {
        const actualHeader = this.header.textContent()
        const expectedHeader = "Add/Remove Elements"
        const checkPassed = actualHeader === expectedHeader
        return checkPassed
      }
    })
  }
  
  async addElement () {
    await Promise.all([this.addElementButton.click()])
    this.page.screenshot({ path: 'screenshots/deleteButtonVisibility.png' })

    const deleted = this.deleteButton
    if (deleted.isVisible()) {
      console.log('Deleted Button is visible')
    }
  }
}

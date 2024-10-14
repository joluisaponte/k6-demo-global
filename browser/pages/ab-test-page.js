import { sleep, check } from "k6"

export class AbTestPage {
  constructor(page) {
    this.page = page
    this.abTestHeader = page.locator('//*[@class="example"]//h3')
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/abtest', { waitUntil: 'networkidle'})
  }

  async validateAbTestPage() {
    check(this.page, {
      "A/B test header is correct": () => {
        const actualHeader = this.abTestHeader.textContent()
        const expectedHeader = "A/B Test Variation 1"
        const checkPassed = actualHeader === expectedHeader
        return checkPassed
      }
    })
    this.page.screenshot({ path: 'screenshots/abTestpage.png' })
  }
}